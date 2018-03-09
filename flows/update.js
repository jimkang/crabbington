var curry = require('lodash.curry');
var updateGrid = require('./update-grid');
var updateSoul = require('./update-soul');
var rbush = require('rbush');

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
    // gameState.player.grid.id
  }

  if (turn === 0) {
    gameState.grids.forEach(curry(updateGrid)(targetTree));
  }
  gameState.souls.forEach(curry(updateSoul)(gameState.grids, targetTree));
  turn += 1;
}

module.exports = update;
