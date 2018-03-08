var updateGrid = require('./update-grid');
var turn = 0;

function update({ gameState }) {
  if (turn === 0) {
    gameState.grids.forEach(updateGrid);
  }
  turn += 1;
}

module.exports = update;
