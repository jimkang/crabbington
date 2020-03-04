import { Soul, Grid, GridIntersection } from '../types';

var findWhere = require('lodash.findwhere');
import { getBoxAroundPosition } from '../tasks/box-ops';

function updateSoul(grids: Array<Grid>, targetTree, soul: Soul) {
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

  var intersection: GridIntersection =
    grid.rows[soul.gridContext.colRow[1]][soul.gridContext.colRow[0]];
  soul.x = intersection.pt[0];
  soul.y = intersection.pt[1];
  var box = getBoxAroundPosition({
    center: [soul.gridContext.colRow[0], soul.gridContext.colRow[1]],
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
