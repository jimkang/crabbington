var effectFns = require('../grid-effects/grid-effects');
var applyToPointsInRows = require('../apply-to-points-in-rows');

import { Grid, GridIntersection, EffectDef } from '../types';

// Not really a radius: More like half a square.
const gridIntersectionRadius = 10;

function updateGrid(targetTree, grid: Grid) {
  var needToUpdateDerived = !gridHasDerivedProps(grid);

  if (grid.effects) {
    applyToPointsInRows(grid.rows, targetTree.remove.bind(targetTree));
    grid.effects.forEach(applyEffect);
    needToUpdateDerived = true;
  }

  if (needToUpdateDerived) {
    applyToPointsInRows(grid.rows, updateDerivedIntersectionProps);
    // Derived properties need to be up-to-date before putting them in the tree.
    // And points with updated properties, need to be (re)added to the tree.
    applyToPointsInRows(grid.rows, targetTree.insert.bind(targetTree));
  }

  function applyEffect(effectDef: EffectDef) {
    grid.rows = effectFns[effectDef.name](effectDef, grid.rows);
  }
}

function updateDerivedIntersectionProps(intersection: GridIntersection) {
  intersection.minX = intersection.pt[0] - gridIntersectionRadius;
  intersection.maxX = intersection.pt[0] + gridIntersectionRadius;
  intersection.minY = intersection.pt[1] - gridIntersectionRadius;
  intersection.maxY = intersection.pt[1] + gridIntersectionRadius;
}

// Cheap check: Assumes a non-empty grid, uniformity among grid points.
function gridHasDerivedProps(grid) {
  // if (!grid || !grid.rows || !grid.rows[0] || !grid.rows[0][0]) {
  //   debugger;
  // }
  return grid.rows[0][0].minX !== undefined;
}

module.exports = updateGrid;
