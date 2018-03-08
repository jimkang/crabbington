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
    { x: center[0], y: center[1] },
    pluck(points, 'value'),
    'x',
    'y'
  );
  for (var i = 0; i < indexesByClosenessToCenter.length; ++i) {
    let index = indexesByClosenessToCenter[i];
    let intersectionObj = points[index].value;
    let point = pt(intersectionObj);
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
    intersectionObj.x = warpedPoint[0];
    intersectionObj.y = warpedPoint[1];
  }
}

function pt(intersectionObj) {
  return [intersectionObj.x, intersectionObj.y];
}

module.exports = gravityWarp;
