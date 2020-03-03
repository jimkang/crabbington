var curry = require('lodash.curry');
var updateGrid = require('./update-grid');
var updateSoul = require('./update-soul');
var rbush = require('rbush');
var findWhere = require('lodash.findwhere');
var math = require('basic-2d-math');
var pluck = require('lodash.pluck');
var callNextTick = require('call-next-tick');

import { Pt, MoveFn, Box, Filter, Soul, GridContext } from '../types';

// Not really a radius: More like half a square.
const clickRadius = 20;

var targetTree = rbush(9);
var turn = 0;

function update({ gameState, recentClickX, recentClickY, commands, probable }) {
  if (commands) {
    commands.forEach(curry(runCommand)(gameState));
    return;
  }
  if (gameState.allowAdvance && !isNaN(recentClickX) && !isNaN(recentClickY)) {
    var thingsHit = targetTree.search({
      minX: recentClickX - clickRadius,
      maxX: recentClickX + clickRadius,
      minY: recentClickY - clickRadius,
      maxY: recentClickY + clickRadius
    });
    // console.log('thingsHit', thingsHit);

    // Assuming: if there is more than one intersection from the same grid hit,
    // there are so close that it doesn't matter which one we pick.
    // If it does matter, we can sort thingsHit by click distance.
    var player: Soul = gameState.player;
    var selectedGridPoint = findWhere(thingsHit, {
      gridId: player.gridContext.id
    });
    if (selectedGridPoint) {
      if (
        selectedGridPoint.col === player.gridContext.colOnGrid &&
        selectedGridPoint.row === player.gridContext.rowOnGrid
      ) {
        gameState.uiOn = true;
        // TODO: This shouldn't increment turn.
      } else if (
        pointsAreAdjacent(
          [selectedGridPoint.col, selectedGridPoint.row],
          [player.gridContext.colOnGrid, player.gridContext.rowOnGrid]
        )
      ) {
        // Eventually, things other than clicking an adjacent space should
        // trigger interact().
        interact(gameState, thingsHit, selectedGridPoint, probable);
      }
    }
  }

  if (turn === 0) {
    gameState.grids.forEach(curry(updateGrid)(targetTree));
  }
  gameState.souls.forEach(curry(updateSoul)(gameState.grids, targetTree));
  turn += 1;
}

function interact(gameState, thingsHit, selectedGridPoint, probable) {
  movePlayer(gameState, selectedGridPoint);
  gameState.souls.forEach(curry(moveSoul)(gameState, probable));
}

function movePlayer(gameState, selectedGridPoint) {
  var player: Soul = gameState.player;
  player.facing = getFacingDir(player.gridContext, [
    selectedGridPoint.col,
    selectedGridPoint.row
  ]);
  player.gridContext.colOnGrid = selectedGridPoint.col;
  player.gridContext.rowOnGrid = selectedGridPoint.row;
}

function moveSoul(gameState, probable, soul: Soul) {
  // TODO: Moving for an actual reason.
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
  var dest: Pt = move({ soul, neighbors, probable, getTargetsInBox });
  if (dest) {
    soul.facing = getFacingDir(soul.gridContext, dest);
    soul.gridContext.colOnGrid = dest[0];
    soul.gridContext.rowOnGrid = dest[1];
  }
}

// Cardinally adjacent, that is.
function pointsAreAdjacent(a, b) {
  var dist = math.getVectorMagnitude(math.subtractPairs(a, b));
  return dist === 1;
}

function getNeighboringGridPoints(soul: Soul, grid) {
  var neighbors = [
    [soul.gridContext.colOnGrid + 1, soul.gridContext.rowOnGrid],
    [soul.gridContext.colOnGrid, soul.gridContext.rowOnGrid + 1],
    [soul.gridContext.colOnGrid - 1, soul.gridContext.rowOnGrid],
    [soul.gridContext.colOnGrid, soul.gridContext.rowOnGrid - 1]
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

function runCommand(gameState, command) {
  var thingsHit;

  if (command.cmdType === 'blast') {
    // This probably should be based on something other than the sprite size.
    var blastBox = {
      minX: gameState.player.x - 3 * gameState.player.sprite.width,
      maxX: gameState.player.x + 3 * gameState.player.sprite.width,
      minY: gameState.player.y - 3 * gameState.player.sprite.height,
      maxY: gameState.player.y + 3 * gameState.player.sprite.height
    };
    thingsHit = getTargetsInBox({ filter: isBlastable, box: blastBox });
    console.log('blasting:', thingsHit);
    gameState.animations.push({
      type: 'blast',
      cx: gameState.player.x,
      cy: gameState.player.y,
      r: 3 * gameState.player.sprite.width,
      duration: 1000,
      postAnimationGameStateUpdater: doSoulRemoval
    });
  }

  function doSoulRemoval(done) {
    removeSouls(gameState, thingsHit);
    callNextTick(done);
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
  srcGridContext: GridContext,
  dest: [number, number]
): [number, number] {
  return math.subtractPairs(dest, [
    srcGridContext.colOnGrid,
    srcGridContext.rowOnGrid
  ]);
}

module.exports = update;
