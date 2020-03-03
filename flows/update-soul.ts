import { Soul } from '../types';

var findWhere = require('lodash.findwhere');
import { getBoxAroundPosition } from '../tasks/get-box-around-position';

function updateSoul(grids, targetTree, soul: Soul) {
  // Update position properties.
  var grid = findWhere(grids, { id: soul.gridContext.id });
  if (!grid) {
    console.log(
      'Could not find grid',
      soul.gridContext.id,
      'for',
      soul.id,
      '!'
    );
    return;
  }

  var intersection =
    grid.rows[soul.gridContext.rowOnGrid][soul.gridContext.colOnGrid];
  soul.x = intersection.x;
  soul.y = intersection.y;
  var box = getBoxAroundPosition({
    position: [soul.gridContext.colOnGrid, soul.gridContext.rowOnGrid],
    boxWidth: soul.sprite.width,
    boxHeight: soul.sprite.height
  });
  Object.assign(soul, box);

  // Update it the search tree.
  // Someday always removing and inserting may be a performance issue?
  targetTree.remove(soul);
  targetTree.insert(soul);
}

module.exports = updateSoul;
