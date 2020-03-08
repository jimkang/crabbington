var curry = require('lodash.curry');
var findWhere = require('lodash.findwhere');
var math = require('basic-2d-math');
var pluck = require('lodash.pluck');
var flatten = require('lodash.flatten');
var isEqual = require('lodash.isequal');

import {
  ColRow,
  MoveFn,
  Box,
  Soul,
  GameState,
  Command,
  CommandDef,
  GridIntersection,
  UpdateResult,
  TargetTree
} from '../types';

import { spriteSize } from '../sizes';
import { getBoxAroundCenter, getBoxAroundPosition } from '../ops/box-ops';
import { instantiateCmdFromDef } from './commands/commands';
import { moveCmd } from './commands/move-command';
import { getNeighboringColRows } from '../ops/grid-ops';
import { getLastClickedSoul } from '../ops/game-state-ops';

// Not really a radius: More like half a square.
const clickRadius = spriteSize / 2;

const diagonalUnitLength = Math.sqrt(2);

var moveCmdDef: CommandDef = {
  id: 'move',
  name: 'Move',
  cmdFn: moveCmd
};

// update() will stop and call back any time
// a render is needed.
export function update({
  actor,
  gameState,
  recentClickX,
  recentClickY,
  probable,
  targetTree
}: {
  actor: Soul;
  gameState: GameState;
  recentClickX: number;
  recentClickY: number;
  probable;
  targetTree: TargetTree;
}): UpdateResult {
  if (!gameState.gameWon && gameWon(gameState)) {
    gameState.displayMessage =
      "With the grail to sleep in, you are assured as much safe, restful sleep as you'd like for the rest of your life. You have won! Feel free to hang out as long as you'd like, though.";
    gameState.gameWon = true;
    return {
      shouldAdvanceToNextSoul: true,
      renderShouldWaitToAdvanceToNextUpdate: false
    };
  }
  if (!gameState.deathNoticeSent && gameState.player.hp < 1) {
    gameState.displayMessage =
      'You have died without finding the shell of your dreams.<p>Hit New Game to play another game or reload the page to play this exact game again. (Or just close the tab if this all makes you feel sad.)</p>';
    gameState.deathNoticeSent = true;
    return {
      shouldAdvanceToNextSoul: true,
      renderShouldWaitToAdvanceToNextUpdate: true
    };
  }

  // If there are commands on the queue, run them
  // all (one per update call) until they're all run.
  // TODO: Actually test that multiple cmds case.
  if (gameState && gameState.cmdQueue.length > 0) {
    // This passes back animation completion callbacks
    // which must be called in order to let render()
    // know it can move on.
    let cmd: Command = gameState.cmdQueue.shift();

    // It's important to keep in mind cmdFn may also
    // run a callback that makes updates to the state after
    // any animations it does during the render phase completes.
    // So, updates can sometimes happen during the render run
    // following this update run.
    cmd.cmdFn({ gameState, targetTree, cmd, probable });
    return {
      shouldAdvanceToNextSoul: false,
      renderShouldWaitToAdvanceToNextUpdate: false
    };
  }

  if (actor.id === 'player') {
    return specificToPlayerUpdate({
      actor,
      gameState,
      recentClickX,
      recentClickY,
      targetTree
    });
  } else {
    let actionCmd: Command = getSoulAction(
      gameState,
      probable,
      actor,
      targetTree
    );
    if (actionCmd) {
      actionCmd.cmdFn({ gameState, targetTree, cmd: actionCmd, probable });
    }

    return {
      shouldAdvanceToNextSoul: true,
      renderShouldWaitToAdvanceToNextUpdate: false
    };
  }
}

function specificToPlayerUpdate({
  actor,
  gameState,
  recentClickX,
  recentClickY,
  targetTree
}: {
  actor: Soul;
  gameState: GameState;
  recentClickX: number;
  recentClickY: number;
  targetTree: TargetTree;
}): UpdateResult {
  // Find out if something relevant got clicked.
  // Things getting clicked are a player-specific thing.
  if (
    actor.id === 'player' &&
    gameState.allowAdvance &&
    !isNaN(recentClickX) &&
    !isNaN(recentClickY)
  ) {
    var clickBox: Box = getBoxAroundCenter({
      center: [recentClickX, recentClickY],
      boxWidth: clickRadius,
      boxHeight: clickRadius
    });
    var thingsHit = targetTree.search(clickBox);
    gameState.lastClickedThingIds = pluck(thingsHit, 'id');

    // Assuming: if there is more than one intersection from the same grid hit,
    // they are so close that it doesn't matter which one we pick.
    // If it does matter, we can sort thingsHit by click distance.
    // Things with gridIds are GridIntersections.
    var selectedIntersection: GridIntersection = findWhere(thingsHit, {
      gridId: actor.gridContext.id
    });
    if (selectedIntersection) {
      return updateUsingClickedIntersection({
        actor,
        selectedIntersection,
        gameState,
        thingsHit
      });
    } else {
      return {
        shouldAdvanceToNextSoul: false,
        renderShouldWaitToAdvanceToNextUpdate: true
      };
    }
  } else {
    // It's still the player's turn.
    return {
      shouldAdvanceToNextSoul: false,
      renderShouldWaitToAdvanceToNextUpdate: true
    };
  }
}

function updateUsingClickedIntersection({
  actor,
  selectedIntersection,
  gameState,
  thingsHit
}: {
  actor: Soul;
  selectedIntersection: GridIntersection;
  gameState: GameState;
  thingsHit;
}): UpdateResult {
  var isActorIntersection: boolean = isEqual(
    selectedIntersection.colRow,
    actor.gridContext.colRow
  );
  // TODO: Long-range bonk item that passes a much
  // higher value that diagonalUnitLength here.
  var isAdjacent: boolean = intersectionsAreAdjacent(
    diagonalUnitLength,
    selectedIntersection.colRow,
    actor.gridContext.colRow
  );

  var cmdChoices: Array<Command> = [];
  if (isActorIntersection || isAdjacent) {
    let cmdDefs: Array<CommandDef> = thingsHit
      .map(curry(actor.getInteractionsWithThing)(actor))
      .flat();
    // TODO: Pick appropriate targets; using getLastClickedSoul
    // is the cause of the bug in which there's sometimes
    // nothing to take.
    cmdChoices = cmdDefs.map(
      curry(instantiateCmdFromDef)(actor, [getLastClickedSoul(gameState)], null)
    );
  }

  if (cmdChoices.length > 0) {
    gameState.cmdChoices = cmdChoices;
    // This shouldn't increment the turn.
    gameState.uiOn = true;
    return {
      shouldAdvanceToNextSoul: false,
      renderShouldWaitToAdvanceToNextUpdate: true
    };
  } else {
    if (!isActorIntersection) {
      const isCardinallyAdjacent: boolean = intersectionsAreAdjacent(
        1,
        selectedIntersection.colRow,
        actor.gridContext.colRow
      );
      if (
        isCardinallyAdjacent &&
        actor.canMoveHereFn({
          getTargetsAtColRow: curry(getTargetsAtColRow)(gameState),
          colRow: selectedIntersection.colRow
        })
      ) {
        let moveCmd: Command = instantiateCmdFromDef(
          actor,
          [],
          { destColRow: selectedIntersection.colRow },
          moveCmdDef
        );
        gameState.uiOn = false;
        gameState.cmdQueue.push(moveCmd);
      }
    }
    // Else: Other interactions on player intersection?

    return {
      shouldAdvanceToNextSoul: true,
      renderShouldWaitToAdvanceToNextUpdate: false
    };
  }
}

function getSoulAction(
  gameState: GameState,
  probable,
  soul: Soul,
  targetTree: TargetTree
): Command {
  if (!soul.getInteractionsWithThing) {
    haveSoulPickMove(gameState, probable, soul);
    return;
  }

  // Get adjacent tiles, then get action choices.
  var neighbors: Array<ColRow> = getNeighboringColRows(
    soul,
    findWhere(gameState.grids, { id: soul.gridContext.id })
  );
  var colRowCmds: Array<Command> = flatten(
    neighbors.map(
      curry(getColRowCommands)(gameState, probable, soul, targetTree)
    )
  );
  // TODO: The soul def should define how to choose between
  // these actions, and moving should be a normal action.
  if (colRowCmds.length < 1 || probable.roll(3) === 0) {
    return haveSoulPickMove(gameState, probable, soul);
  }

  return probable.pick(colRowCmds);
}

function getColRowCommands(
  gameState: GameState,
  probable,
  soul: Soul,
  targetTree: TargetTree,
  colRow: ColRow
): Array<Command> {
  var box = getBoxAroundPosition({
    center: colRow,
    boxWidth: soul.sprite.width,
    boxHeight: soul.sprite.height
  });
  var thingsInColRow = targetTree.search(box);
  if (thingsInColRow.length < 1) {
    return [];
  }

  // TODO: Someday be able to do stuff with anything
  // the stack at this colRow instead of just the top?
  // For now, filter out things that aren't on the same grid.
  thingsInColRow = thingsInColRow.filter(
    thing =>
      (thing as Soul).gridContext &&
      (thing as Soul).gridContext.id === soul.gridContext.id
  );
  if (thingsInColRow.length < 1) {
    return [];
  }

  var cmdDefs: Array<CommandDef> = soul.getInteractionsWithThing(
    soul,
    thingsInColRow[0]
  );
  return cmdDefs.map(curry(instantiateCmdFromDef)(soul, thingsInColRow, null));
}

function haveSoulPickMove(gameState, probable, soul: Soul): Command {
  var move: MoveFn = soul.move;
  if (!soul.move) {
    return;
  }

  var neighbors = getNeighboringColRows(
    soul,
    findWhere(gameState.grids, { id: soul.gridContext.id })
  );
  var destColRow: ColRow = move({
    soul,
    neighbors,
    probable,
    getTargetsAtColRow: curry(getTargetsAtColRow)(gameState),
    canMoveHereFn: soul.canMoveHereFn
  });
  if (destColRow) {
    return instantiateCmdFromDef(soul, [], { destColRow }, moveCmdDef);
  }
}

// If maxDist === 1, this finds cardinally adjacent points.
// If maxDist === Math.sqrt(2), this finds diagonally and cardinally
// adjacent points.
function intersectionsAreAdjacent(maxDist: number, a: ColRow, b: ColRow) {
  var dist = math.getVectorMagnitude(math.subtractPairs(a, b));
  return dist <= maxDist;
}

function gameWon(gameState: GameState): boolean {
  return findWhere(gameState.player.items, { type: 'grail' }) !== undefined;
}

function getTargetsAtColRow(
  gameState: GameState,
  { colRow }: { colRow: ColRow }
): Array<Soul> {
  return gameState.soulTracker.getSouls().filter(colRowMatches);

  function colRowMatches(soul: Soul) {
    return isEqual(soul.gridContext.colRow, colRow);
  }
}
