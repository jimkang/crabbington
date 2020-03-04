var rowOps = require('../row-ops');
var curry = require('lodash.curry');
var pluck = require('lodash.pluck');
var sortCellsByDist = require('sort-cells-by-dist');
var math = require('basic-2d-math');

import { Pt, EffectDef, GridIntersection } from '../types';

function gravityWarp(
  { centers, strength, decayDist }: EffectDef,
  intersectionsInRows: Array<Array<GridIntersection>>
): Array<Array<GridIntersection>> {
  var flattened = rowOps.flattenRowsButKeepOrigins(intersectionsInRows);
  centers.forEach(
    curry(warpTowardCenter)({
      wrappedIntersections: flattened,
      strength,
      decayDist
    })
  );
  return rowOps.reconstituteIntoRows(flattened);
}

function warpTowardCenter(
  { wrappedIntersections, strength, decayDist },
  center: Pt
) {
  var indexesByClosenessToCenter = sortCellsByDist(
    center,
    pluck(wrappedIntersections, 'value'),
    '0',
    '1'
  );
  for (var i = 0; i < indexesByClosenessToCenter.length; ++i) {
    let index = indexesByClosenessToCenter[i];
    let intersectionObj: GridIntersection = wrappedIntersections[index].value;
    let dist = math.getVectorMagnitude(
      math.subtractPairs(intersectionObj.pt, center)
    );
    if (dist > decayDist) {
      break;
    }
    // Decay can be fancier than linear later.
    var changeStrength = (strength * (decayDist - dist)) / decayDist;
    var vectorTowardCenter = math.changeVectorMagnitude(
      math.subtractPairs(center, intersectionObj.pt),
      changeStrength
    );
    var warpedPoint = math.addPairs(intersectionObj.pt, vectorTowardCenter);
    intersectionObj.pt = warpedPoint;
  }
}

module.exports = gravityWarp;
