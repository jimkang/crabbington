var findWhere = require('lodash.findwhere');

function updateSoul(grids, targetTree, soul) {
  // Update position properties.
  var grid = findWhere(grids, { id: soul.grid.id });
  if (!grid) {
    console.log('Could not find grid', soul.grid.id, 'for', soul.id, '!');
    return;
  }

  var intersection = grid.rows[soul.grid.row][soul.grid.col];
  soul.minX = intersection[0] - soul.sprite.width / 2;
  soul.maxX = intersection[0] + soul.sprite.width / 2;
  soul.minY = intersection[1] - soul.sprite.height / 2;
  soul.maxY = intersection[1] + soul.sprite.height / 2;

  // Update it the search tree.
  // Someday always removing and inserting may be a performance issue?
  targetTree.remove(soul);
  targetTree.insert(soul);
}

module.exports = updateSoul;
