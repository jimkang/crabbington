var generateGravityWarp = require('./effects/generate-gravity-warp');

import { spriteSize, gridWidthSprites, gridHeightSprites } from '../sizes';

function generateGrids({ probable }) {
  /*
  var spaceSizeTable = probable.createTableFromSizes([
    [4, 128],
    //[3, 64],
    [1, 256]
  ]);
  var numberOfUnitsTable = probable.createTableFromSizes([
    [4, 10],
    [3, 6],
    [2, 4],
    [1, 2]
  ]);
  */
  var numberOfEffectsTable = probable.createTableFromSizes([
    [2, 0],
    [2, 1],
    [1, 2]
  ]);

  var airGrid = generateGrid({
    id: 'grid-air',
    unitWidth: spriteSize * 2,
    unitHeight: spriteSize * 2,
    gridWidth: spriteSize * gridWidthSprites,
    gridHeight: spriteSize * gridHeightSprites
  });
  var airEffects = [];
  let numberOfEffects = numberOfEffectsTable.roll();
  if (numberOfEffects > 0) {
    airEffects = [];
  }
  for (let j = 0; j < numberOfEffects; ++j) {
    // TODO: When there's more than kind of effect, pick among them.
    airEffects.push(generateGravityWarp({ grid: airGrid, probable }));
  }
  airGrid.effects = airEffects;

  return [
    generateGrid({
      id: 'grid-ground',
      unitWidth: spriteSize,
      unitHeight: spriteSize,
      gridWidth: spriteSize * gridWidthSprites,
      gridHeight: spriteSize * gridHeightSprites
    }),
    generateGrid({
      id: 'grid-figures',
      unitWidth: spriteSize,
      unitHeight: spriteSize,
      gridWidth: spriteSize * gridWidthSprites,
      gridHeight: spriteSize * gridHeightSprites
    }),
    airGrid
  ];

  function generateGrid({ id, unitWidth, unitHeight, gridWidth, gridHeight }) {
    let numberOfCols = gridWidth / unitWidth;
    let numberOfRows = gridHeight / unitHeight;
    let grid = {
      id,
      unitWidth,
      unitHeight,
      xOffset: 0,
      yOffset: 0,
      numberOfCols,
      numberOfRows,
      width: gridWidth,
      height: gridHeight,
      color: `hsl(${probable.roll(360)}, 50%, 50%)`
    };
    grid.rows = getIntersectionRows(grid);
    return grid;
  }
}

function getIntersectionRows(grid) {
  var rows = [];
  for (var rowIndex = 0; rowIndex < grid.numberOfRows; ++rowIndex) {
    let row = [];
    for (var colIndex = 0; colIndex < grid.numberOfCols; ++colIndex) {
      row.push({
        x: grid.xOffset + colIndex * grid.unitWidth,
        y: grid.yOffset + rowIndex * grid.unitHeight,
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
