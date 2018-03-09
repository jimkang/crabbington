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

function update({ gameState, recentClickX, recentClickY }) {
  if (!isNaN(recentClickX) && !isNaN(recentClickY)) {
    var thingsHit = targetTree.search({
      minX: recentClickX - clickRadius,
      maxX: recentClickX + clickRadius,
      minY: recentClickY - clickRadius,
      maxY: recentClickY + clickRadius
    });
    console.log('thingsHit', thingsHit);
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

  if (turn === 0) {
    gameState.grids.forEach(curry(updateGrid)(targetTree));
  }
  gameState.souls.forEach(curry(updateSoul)(gameState.grids, targetTree));
  turn += 1;
}

// Cardinally adjacent, that is.
function pointsAreAdjacent(a, b) {
  var dist = math.getVectorMagnitude(math.subtractPairs(a, b));
  return dist === 1;
}

module.exports = update;
