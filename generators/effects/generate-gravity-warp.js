var range = require('d3-array').range;

function generateGravityWarp({ grid, probable }) {
  var numberOfCentersTable = probable.createTableFromSizes([
    [4, 1],
    [4, 2],
    [4, 3],
    [2, 4],
    [2, 5],
    [1, 6]
  ]);
  var averageSpan = (grid.width + grid.height) / 2;

  return {
    name: 'gravityWarp',
    centers: range(numberOfCentersTable.roll()).map(generateCenter),
    strength: probable.roll(32) + probable.roll(32),
    decayDist: averageSpan / 5 + probable.roll(averageSpan * 0.4)
  };

  function generateCenter() {
    return [probable.roll(grid.width), probable.roll(grid.height)];
  }
}

module.exports = generateGravityWarp;
