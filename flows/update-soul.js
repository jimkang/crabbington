var findWhere = require('lodash.findwhere');

function updateSoul(grids, targetTree, soul) {
  // Update position properties.
  var grid = findWhere(grids, { id: soul.grid.id });
  if (!grid) {
    console.log('Could not find grid', soul.grid.id, 'for', soul.id, '!');
    return;
  }

  var intersection = grid.rows[soul.grid.rowOnGrid][soul.grid.colOnGrid];
  soul.x = intersection.x;
  soul.y = intersection.y;
  soul.minX = soul.x - soul.sprite.width / 2;
  soul.maxX = soul.x + soul.sprite.width / 2;
  soul.minY = soul.y - soul.sprite.height / 2;
  soul.maxY = soul.y + soul.sprite.height / 2;

  // Update it the search tree.
  // Someday always removing and inserting may be a performance issue?
  targetTree.remove(soul);
  targetTree.insert(soul);
}

module.exports = updateSoul;
