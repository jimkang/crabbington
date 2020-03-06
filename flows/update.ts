var curry = require('lodash.curry');
var updateGrid = require('./update-grid');
var updateSoul = require('./update-soul');
var rbush = require('rbush');
var findWhere = require('lodash.findwhere');
var math = require('basic-2d-math');
var pluck = require('lodash.pluck');
var uniq = require('lodash.uniq');
var isEqual = require('lodash.isequal');
var queue = require('d3-queue').queue;
var oknok = require('oknok');
var handleError = require('handle-error-web');
var callNextTick = require('call-next-tick');

import {
  ColRow,
  MoveFn,
  Box,
  Filter,
  Soul,
  GridContext,
  GameState,
  Command,
  GridIntersection,
  Pt,
  Done
} from '../types';

import { spriteSize } from '../sizes';
import { getBoxAroundCenter } from '../tasks/box-ops';
import { sortVectorsByCloseness } from '../tasks/dist-ops';

// Not really a radius: More like half a square.
const clickRadius = spriteSize / 3;

var targetTree = rbush(9);
var turn = 0;

function update({
  gameState,
  recentClickX,
  recentClickY,
  commands,
  probable
}: {
  gameState: GameState;
  recentClickX: number;
  recentClickY: number;
  commands?: Array<Command>;
  probable;
}) {
  if (!gameState.gridsInit) {
    // It's important to call updateSoul during
    // init because it gets the souls into the targetTree.
    gameState.souls.forEach(curry(updateSoul)(gameState.grids, targetTree));
    gameState.grids.forEach(curry(updateGrid)(targetTree));
    gameState.gridsInit = true;
  }
  if (commands && commands.length > 0) {
    // This passes back animation completion callbacks
    // which must be called in order to let render()
    // know it can move on.
    runCommands(
      commands,
      gameState,
      oknok({ ok: reactAndIncrement, nok: handleError })
    );
    return;
  }

  if (!gameState.gameWon && gameWon(gameState)) {
    gameState.displayMessage =
      "With the grail to sleep in, you are assured as much safe, restful sleep as you'd like for the rest of your life. You have won! Feel free to hang out as long as you'd like, though.";
    gameState.gameWon = true;
    return;
  }

  // Find out if something relevant got clicked.
  if (gameState.allowAdvance && !isNaN(recentClickX) && !isNaN(recentClickY)) {
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
      gridId: gameState.player.gridContext.id
    });
    if (selectedIntersection) {
      updateUsingGridSelection({
        selectedIntersection,
        gameState,
        thingsHit,
        probable
      });
    }
  }

  // Gets called by runCommands with an array of
  // postAnimationGameStateUpdater results.
  function reactAndIncrement(notifyAnimationDones: Array<Done>) {
    haveSoulsReact(gameState, probable);
    incrementTurn();
    if (notifyAnimationDones) {
      notifyAnimationDones.forEach(
        notifyAnimationDone => notifyAnimationDone && notifyAnimationDone(null)
      );
    }
  }
}

// Early returns in this function will skip incrementing the turn
// and updating the souls.
function updateUsingGridSelection({
  selectedIntersection,
  gameState,
  thingsHit,
  probable
}: {
  selectedIntersection: GridIntersection;
  gameState: GameState;
  thingsHit;
  probable;
}) {
  var shouldIncrementTurn = false;
  var player: Soul = gameState.player;
  var isPlayerIntersection: boolean = isEqual(
    selectedIntersection.colRow,
    player.gridContext.colRow
  );
  var isAdjacent: boolean = pointsAreAdjacent(
    selectedIntersection.colRow,
    player.gridContext.colRow
  );

  if (isPlayerIntersection || isAdjacent) {
    gameState.actionChoices = uniq(
      thingsHit.map(player.getInteractionsWithThing).flat()
    );
  }

  if (gameState.actionChoices.length > 0) {
    // This shouldn't increment the turn.
    gameState.uiOn = true;
  } else {
    if (!isPlayerIntersection) {
      if (
        isAdjacent &&
        gameState.player.canMoveHereFn({
          getTargetsAtColRow: curry(getTargetsAtColRow)(gameState),
          colRow: selectedIntersection.colRow
        })
      ) {
        movePlayer(gameState, selectedIntersection);
        haveSoulsReact(gameState, probable);
        shouldIncrementTurn = true;
      }
    }
    // Else: Other interactions on player intersection?
  }

  if (shouldIncrementTurn) {
    incrementTurn();
  }
}

function incrementTurn() {
  console.log('Turn', turn, 'complete.');
  turn += 1;
}

function haveSoulsReact(gameState: GameState, probable) {
  // TODO: Stuff other than moving.
  gameState.souls.forEach(curry(moveSoul)(gameState, probable));
  gameState.souls.forEach(curry(updateSoul)(gameState.grids, targetTree));
}

function movePlayer(
  gameState: GameState,
  selectedGridIntersection: GridIntersection
) {
  var player: Soul = gameState.player;
  player.facing = getFacingDir(
    player.facingsAllowed,
    player.gridContext,
    selectedGridIntersection.colRow
  );
  player.gridContext.colRow = selectedGridIntersection.colRow;
}

function moveSoul(gameState, probable, soul: Soul) {
  if (soul.id === 'player') {
    return;
  }
  var move: MoveFn = soul.move;
  if (!soul.move) {
    return;
  }

  var neighbors = getNeighboringGridPoints(
    soul,
    findWhere(gameState.grids, { id: soul.gridContext.id })
  );
  var dest: ColRow = move({
    soul,
    neighbors,
    probable,
    getTargetsAtColRow: curry(getTargetsAtColRow)(gameState),
    canMoveHereFn: soul.canMoveHereFn
  });
  if (dest) {
    soul.facing = getFacingDir(soul.facingsAllowed, soul.gridContext, dest);
    soul.gridContext.colRow = dest;
  }
}

// Cardinally adjacent, that is.
function pointsAreAdjacent(a, b) {
  var dist = math.getVectorMagnitude(math.subtractPairs(a, b));
  return dist === 1;
}

function getNeighboringGridPoints(soul: Soul, grid) {
  var neighbors = [
    [soul.gridContext.colRow[0] + 1, soul.gridContext.colRow[1]],
    [soul.gridContext.colRow[0], soul.gridContext.colRow[1] + 1],
    [soul.gridContext.colRow[0] - 1, soul.gridContext.colRow[1]],
    [soul.gridContext.colRow[0], soul.gridContext.colRow[1] - 1]
  ];
  return neighbors.filter(isInGridBounds);

  function isInGridBounds(neighbor) {
    return (
      neighbor[0] >= 0 &&
      neighbor[0] < grid.rows[0].length &&
      neighbor[1] >= 0 &&
      neighbor[1] < grid.rows.length
    );
  }
}

// All execution paths in this function must call the callback.
function runCommand(
  gameState: GameState,
  command: Command,
  doneWithAnimationCompletionCallback: Done
) {
  var thingsToRemove = [];

  if (command.cmdType === 'blast') {
    // This probably should be based on something other than the sprite size.
    var blastBox = {
      minX: gameState.player.x - 3 * gameState.player.sprite.width,
      maxX: gameState.player.x + 3 * gameState.player.sprite.width,
      minY: gameState.player.y - 3 * gameState.player.sprite.height,
      maxY: gameState.player.y + 3 * gameState.player.sprite.height
    };
    thingsToRemove = getTargetsInBox({ filter: isBlastable, box: blastBox });
    console.log('blasting:', thingsToRemove);
    gameState.animations.push({
      type: 'blast',
      cx: gameState.player.x,
      cy: gameState.player.y,
      r: 3 * gameState.player.sprite.width,
      duration: 1000,
      postAnimationGameStateUpdater: updateStatePostBlastAnimation
    });
  } else if (command.cmdType === 'take') {
    var item: Soul = gameState.souls.find(isALastClickedItem);
    if (item) {
      gameState.player.items.push(item);
      thingsToRemove.push(item);
      doSoulRemoval();
    } else {
      throw new Error('Somehow no item to take.');
    }
    console.log('Take it!');
    callNextTick(doneWithAnimationCompletionCallback, null);
  }

  function updateStatePostBlastAnimation(notifyAnimationDone: Done) {
    doSoulRemoval();
    doneWithAnimationCompletionCallback(null, notifyAnimationDone);
  }

  function doSoulRemoval() {
    removeSouls(gameState, thingsToRemove);
  }

  function isALastClickedItem(soul: Soul) {
    return gameState.lastClickedThingIds.includes(soul.id);
  }
}

function runCommands(
  commands: Array<Command>,
  gameState: GameState,
  doneWithAnimationCompletionCallbacks: Done
) {
  var q = queue(1);
  commands.forEach(queueRun);
  q.awaitAll(doneWithAnimationCompletionCallbacks);

  function queueRun(command: Command) {
    q.defer(runCommand, gameState, command);
  }
}

function isBlastable(thing) {
  // For now, only blast other souls.
  return thing.type && thing.type !== 'player';
}

function removeSouls(gameState, souls) {
  var ids = pluck(souls, 'id');
  souls.forEach(removeFromTargetTree);

  // Find souls that match these ids, then splice them out of the array.
  for (var i = gameState.souls.length - 1; i >= 0; --i) {
    if (ids.indexOf(gameState.souls[i].id) !== -1) {
      gameState.souls.splice(i, 1);
    }
  }
}

function removeFromTargetTree(soul: Soul) {
  targetTree.remove(soul);
}

function getTargetsInBox({
  box,
  filter
}: {
  box: Box;
  filter?: Filter;
}): Array<Soul> {
  var targets = targetTree.search(box);
  // TODO: Further check that these are actually in a circle, rather than just
  // in a box circumscribing it.
  if (filter) {
    targets = targets.filter(filter);
  }
  return targets;
}

function getFacingDir(
  facingsAllowed: Array<Pt>,
  srcGridContext: GridContext,
  dest: ColRow
): [number, number] {
  var dir: [number, number] = math.subtractPairs(dest, srcGridContext.colRow);
  if (facingsAllowed) {
    // Is it really worth doing this much work to make
    // the guy face the right way?
    dir = sortVectorsByCloseness(dir, facingsAllowed)[0];
  }
  return dir;
}

function gameWon(gameState: GameState): boolean {
  return findWhere(gameState.player.items, { type: 'grail' }) !== undefined;
}

function getTargetsAtColRow(
  gameState: GameState,
  { colRow }: { colRow: ColRow }
): Array<Soul> {
  return gameState.souls.filter(colRowMatches);

  function colRowMatches(soul: Soul) {
    return isEqual(soul.gridContext.colRow, colRow);
  }
}

module.exports = update;
