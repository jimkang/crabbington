var effectFns = require('../grid-effects/grid-effects');
var applyToPointsInRows = require('../apply-to-points-in-rows');

// Not really a radius: More like half a square.
const gridIntersectionRadius = 10;

function updateGrid(targetTree, grid) {
  var needToUpdateDerived = false;
  var needToAddToTree = false;

  if (!grid.rows) {
    grid.rows = getIntersectionRows(grid);
    needToUpdateDerived = true;
    needToAddToTree = true;
  }
  if (grid.effects) {
    applyToPointsInRows(grid.rows, targetTree.remove.bind(targetTree));
    grid.effects.forEach(applyEffect);
    needToAddToTree = true;
    needToUpdateDerived = true;
  }

  if (needToUpdateDerived) {
    applyToPointsInRows(grid.rows, updateDerivedIntersectionProps);
  }
  if (needToAddToTree) {
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
