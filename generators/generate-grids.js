var randomId = require('idmaker').randomId;
var generateGravityWarp = require('./effects/generate-gravity-warp');

function generateGrids({ probable }) {
  var spaceSizeTable = probable.createTableFromSizes([
    [4, 128],
    [3, 64],
    [1, 256]
  ]);
  var gridSizeTable = probable.createTableFromSizes([
    [4, 800],
    [3, 600],
    [2, 400],
    [1, 200]
  ]);
  var numberOfEffectsTable = probable.createTableFromSizes([
    [2, 0],
    [2, 1],
    [1, 2]
  ]);

  var grids = [];
  var numberOfGrids = 1 + probable.rollDie(2);
  for (var i = 0; i < numberOfGrids; ++i) {
    var isSquare = probable.roll(4) > 0;
    var xSpace = spaceSizeTable.roll();
    var ySpace = xSpace;
    if (!isSquare) {
      ySpace = spaceSizeTable.roll();
    }
    let grid = {
      id: 'grid-' + randomId(4),
      xSpace,
      ySpace,
      // TODO: Should this be a separate table?
      xOffset: spaceSizeTable.roll(),
      yOffset: spaceSizeTable.roll(),
      width: gridSizeTable.roll(),
      height: gridSizeTable.roll(),
      // color: probable.pickFromArray(['red', 'green', 'blue'])
      color: `hsl(${probable.roll(360)}, 50%, 50%)`
    };
    let numberOfEffects = numberOfEffectsTable.roll();
    if (numberOfEffects > 0) {
      grid.effects = [];
    }
    for (let j = 0; j < numberOfEffects; ++j) {
      // TODO: When there's more than kind of effect, pick among them.
      grid.effects.push(generateGravityWarp({ grid, probable }));
    }
    grid.rows = getIntersectionRows(grid);
    grids.push(grid);
  }
  return grids;
}

function getIntersectionRows(grid) {
  var rows = [];
  for (var y = grid.yOffset; y <= grid.height; y += grid.ySpace) {
    let row = [];
    for (var x = grid.xOffset; x <= grid.width; x += grid.xSpace) {
      row.push({
        x,
        y,
        col: row.length,
        row: rows.length,
        gridId: grid.id
      });
      // Random warp:
      // row.push([x + (-20 + probable.roll(40)), y + (-20 + probable.roll(40))])
    }
    rows.push(row);
  }
  return rows;
}

module.exports = generateGrids;
