var randomId = require('idmaker').randomId;
var generateGravityWarp = require('./effects/generate-gravity-warp');

function generateGrids({ probable }) {
  var spaceSizeTable = probable.createTableFromSizes([
    [4, 128],
    [3, 64],
    [1, 256]
  ]);
  var numberOfUnitsTable = probable.createTableFromSizes([
    [4, 10],
    [3, 6],
    [2, 4],
    [1, 2]
  ]);
  var numberOfEffectsTable = probable.createTableFromSizes([
    [2, 0],
    [2, 1],
    [1, 2]
  ]);

  var grids = [];
  var numberOfGrids = 1 + probable.rollDie(2);
  for (var i = 0; i < numberOfGrids; ++i) {
    let isSquare = probable.roll(4) > 0;
    let xSpace = spaceSizeTable.roll();
    let ySpace = xSpace;
    if (!isSquare) {
      ySpace = spaceSizeTable.roll();
    }
    let numberOfCols = numberOfUnitsTable.roll();
    let numberOfRows = numberOfUnitsTable.roll();
    let grid = {
      id: 'grid-' + randomId(4),
      xSpace,
      ySpace,
      // TODO: Should this be a separate table?
      xOffset: spaceSizeTable.roll(),
      yOffset: spaceSizeTable.roll(),
      numberOfCols,
      numberOfRows,
      width: numberOfCols * xSpace,
      height: numberOfRows * ySpace,
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
  for (var rowIndex = 0; rowIndex < grid.numberOfRows; ++rowIndex) {
    let row = [];
    for (var colIndex = 0; colIndex < grid.numberOfCols; ++colIndex) {
      row.push({
        x: grid.xOffset + colIndex * grid.xSpace,
        y: grid.yOffset + rowIndex * grid.ySpace,
        col: colIndex,
        row: rowIndex,
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
