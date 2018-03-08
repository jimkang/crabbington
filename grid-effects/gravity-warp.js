var rowOps = require('../row-ops');
var curry = require('lodash.curry');
var pluck = require('lodash.pluck');
var sortCellsByDist = require('sort-cells-by-dist');
var math = require('basic-2d-math');

function gravityWarp({ centers, strength, decayDist }, pointsInRows) {
  var flattened = rowOps.flattenRowsButKeepOrigins(pointsInRows);
  centers.forEach(
    curry(warpTowardCenter)({ points: flattened, strength, decayDist })
  );
  return rowOps.reconstituteIntoRows(flattened);
}

function warpTowardCenter({ points, strength, decayDist }, center) {
  var indexesByClosenessToCenter = sortCellsByDist(
    center,
    pluck(points, 'value'),
    '0',
    '1'
  );
  for (var i = 0; i < indexesByClosenessToCenter.length; ++i) {
    let index = indexesByClosenessToCenter[i];
    let point = points[index].value;
    let dist = math.getVectorMagnitude(math.subtractPairs(point, center));
    if (dist > decayDist) {
      break;
    }
    // Decay can be fancier than linear later.
    var changeStrength = strength * (decayDist - dist) / decayDist;
    var vectorTowardCenter = math.changeVectorMagnitude(
      math.subtractPairs(center, point),
      changeStrength
    );
    var warpedPoint = math.addPairs(point, vectorTowardCenter);
    points[index].value = warpedPoint;
  }
}

module.exports = gravityWarp;
