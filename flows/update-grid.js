var effectFns = require('../grid-effects/grid-effects');
var applyToPointsInRows = require('../apply-to-points-in-rows');

// Not really a radius: More like half a square.
const gridIntersectionRadius = 10;

function updateGrid(targetTree, grid) {
  if (!grid.rows) {
    grid.rows = getIntersectionRows(grid);
    applyToPointsInRows(grid.rows, updateDerivedIntersectionProps);
  }
  if (grid.effects) {
    applyToPointsInRows(grid.rows, targetTree.remove.bind(targetTree));
    grid.effects.forEach(applyEffect);
    // This needs to be done every time the grid x and y change.
    applyToPointsInRows(grid.rows, updateDerivedIntersectionProps);
    applyToPointsInRows(grid.rows, targetTree.insert.bind(targetTree));
  }

  function applyEffect(effectDef) {
    grid.rows = effectFns[effectDef.name](effectDef, grid.rows);
  }
}

function getIntersectionRows(grid) {
  var rows = [];
  for (var y = grid.yOffset; y <= grid.height; y += grid.ySpace) {
    let row = [];
    for (var x = grid.xOffset; x <= grid.width; x += grid.xSpace) {
      row.push({
        x,
        y,
        gridId: grid.id
      });
      // Random warp:
      // row.push([x + (-20 + probable.roll(40)), y + (-20 + probable.roll(40))])
    }
    rows.push(row);
  }

  return rows;
}

function updateDerivedIntersectionProps(intersection) {
  intersection.minX = intersection.x - gridIntersectionRadius;
  intersection.maxX = intersection.x + gridIntersectionRadius;
  intersection.minY = intersection.y - gridIntersectionRadius;
  intersection.maxY = intersection.y + gridIntersectionRadius;
}

module.exports = updateGrid;
