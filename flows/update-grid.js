var effectFns = require('../grid-effects/grid-effects');

function updateGrid(grid) {
  if (!grid.rows) {
    grid.rows = getIntersectionRows(grid);
  }
  if (grid.effects) {
    grid.effects.forEach(applyEffect);
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
      row.push([x, y]);
      // Random warp:
      // row.push([x + (-20 + probable.roll(40)), y + (-20 + probable.roll(40))])
    }
    rows.push(row);
  }

  return rows;
}

module.exports = updateGrid;
