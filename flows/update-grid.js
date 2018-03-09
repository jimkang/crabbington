var effectFns = require('../grid-effects/grid-effects');
var applyToPointsInRows = require('../apply-to-points-in-rows');

// Not really a radius: More like half a square.
const gridIntersectionRadius = 10;

function updateGrid(targetTree, grid) {
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

  function applyEffect(effectDef) {
    grid.rows = effectFns[effectDef.name](effectDef, grid.rows);
  }
}

function updateDerivedIntersectionProps(intersection) {
  intersection.minX = intersection.x - gridIntersectionRadius;
  intersection.maxX = intersection.x + gridIntersectionRadius;
  intersection.minY = intersection.y - gridIntersectionRadius;
  intersection.maxY = intersection.y + gridIntersectionRadius;
}

// Cheap check: Assumes a non-empty grid, uniformity among grid points.
function gridHasDerivedProps(grid) {
  return grid.rows[0][0].minX !== undefined;
}

module.exports = updateGrid;
