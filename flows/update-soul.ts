import { Soul, Grid, GridIntersection, TargetTree, Box } from '../types';

var findWhere = require('lodash.findwhere');
import { getBoxAroundPosition } from '../ops/box-ops';

function updateSoul(grids: Array<Grid>, targetTree: TargetTree, soul: Soul) {
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

  // Update it in the search tree.
  targetTree.updateItemBox(soul as Box, box);
}

module.exports = updateSoul;
