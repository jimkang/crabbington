var curry = require('lodash.curry');
var updateGrid = require('./update-grid');
var updateSoul = require('./update-soul');
var rbush = require('rbush');
var findWhere = require('lodash.findwhere');
var math = require('basic-2d-math');

// Not really a radius: More like half a square.
const clickRadius = 20;

var targetTree = rbush(9);
var turn = 0;

function update({ gameState, recentClickX, recentClickY, probable }) {
  if (!isNaN(recentClickX) && !isNaN(recentClickY)) {
    var thingsHit = targetTree.search({
      minX: recentClickX - clickRadius,
      maxX: recentClickX + clickRadius,
      minY: recentClickY - clickRadius,
      maxY: recentClickY + clickRadius
    });
    // console.log('thingsHit', thingsHit);
    interact(gameState, thingsHit, probable);
  }

  if (turn === 0) {
    gameState.grids.forEach(curry(updateGrid)(targetTree));
  }
  gameState.souls.forEach(curry(updateSoul)(gameState.grids, targetTree));
  turn += 1;
}

function interact(gameState, thingsHit, probable) {
  maybeMovePlayer(gameState, thingsHit);
  gameState.souls.forEach(curry(moveSoul)(gameState, probable));
}

function maybeMovePlayer(gameState, thingsHit) {
  // Assuming: if there is more than one intersection from the same grid hit,
  // there are so close that it doesn't matter which one we pick.
  // If it does matter, we can sort thingsHit by click distance.
  var selectedGridPoint = findWhere(thingsHit, {
    gridId: gameState.player.grid.id
  });
  if (
    selectedGridPoint &&
    pointsAreAdjacent(
      [selectedGridPoint.col, selectedGridPoint.row],
      [gameState.player.grid.colOnGrid, gameState.player.grid.rowOnGrid]
    )
  ) {
    gameState.player.grid.colOnGrid = selectedGridPoint.col;
    gameState.player.grid.rowOnGrid = selectedGridPoint.row;
  }
}

function moveSoul(gameState, probable, soul) {
  // TODO: Moving for an actual reason.
  if (soul.id === 'player') {
    return;
  }
  var neighbors = getNeighboringGridPoints(
    soul,
    findWhere(gameState.grids, { id: soul.grid.id })
  );
  console.log('neighbors', neighbors);
  var neighbor = probable.pickFromArray(neighbors);
  soul.grid.colOnGrid = neighbor[0];
  soul.grid.rowOnGrid = neighbor[1];
}

// Cardinally adjacent, that is.
function pointsAreAdjacent(a, b) {
  var dist = math.getVectorMagnitude(math.subtractPairs(a, b));
  return dist === 1;
}

function getNeighboringGridPoints(soul, grid) {
  var neighbors = [
    [soul.grid.colOnGrid + 1, soul.grid.rowOnGrid],
    [soul.grid.colOnGrid, soul.grid.rowOnGrid + 1],
    [soul.grid.colOnGrid - 1, soul.grid.rowOnGrid],
    [soul.grid.colOnGrid, soul.grid.rowOnGrid - 1]
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

module.exports = update;
