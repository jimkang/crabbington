var curry = require('lodash.curry');
var applyToPointsInRows = require('../apply-to-points-in-rows');

import { Grid, GridIntersection, Pt, CurvesKit, BezierStep } from '../types';

function renderGrid({ imageContext, transform, playerGridId }, grid: Grid) {
  drawGridLines({ grid, imageContext, transform, playerGridId });
  drawIntersections({ grid, imageContext, transform, playerGridId });
}

function drawGridLines({
  grid,
  imageContext,
  transform,
  playerGridId
}: {
  grid: Grid;
  imageContext;
  transform;
  playerGridId: string;
}) {
  var cols = rowsToCols(grid.rows);

  var horizontalBezierCurvesPerLine: Array<CurvesKit> = grid.rows.map(
    curry(curvesFromExtremes)(false, transform)
  );
  var verticalBezierCurvesPerLine: Array<CurvesKit> = cols.map(
    curry(curvesFromExtremes)(true, transform)
  );
  // console.log('horizontalBezierCurvesPerLine', horizontalBezierCurvesPerLine);
  // console.log('verticalBezierCurvesPerLine', verticalBezierCurvesPerLine);

  var drawC = curry(drawCurve)(imageContext);

  imageContext.strokeStyle = grid.color;
  imageContext.lineWidth = playerGridId === grid.id ? 2 : 1;
  imageContext.beginPath();

  horizontalBezierCurvesPerLine.forEach(drawLineCurves);
  verticalBezierCurvesPerLine.forEach(drawLineCurves);

  imageContext.stroke();

  // What should be rendered onto inputContext? Circles at intersections?

  // Assumes curves have already beed transformed.
  function drawLineCurves(curvesKit: CurvesKit) {
    imageContext.moveTo.apply(imageContext, curvesKit.start);
    curvesKit.curves.forEach(drawC);
  }
}

// TODO: Consider calling directly without using apply.
function drawCurve(ctx, curveParams: BezierStep) {
  ctx.bezierCurveTo(
    curveParams.srcCtrl[0],
    curveParams.srcCtrl[1],
    curveParams.destCtrl[0],
    curveParams.destCtrl[1],
    curveParams.dest[0],
    curveParams.dest[1]
  );
}

function rowsToCols(rows) {
  var cols = [];
  for (var colIndex = 0; colIndex < rows[0].length; ++colIndex) {
    let col = [];
    for (let rowIndex = 0; rowIndex < rows.length; ++rowIndex) {
      col.push(rows[rowIndex][colIndex]);
    }
    cols.push(col);
  }
  return cols;
}

// Assumes extremes are sorted, ascending.
function curvesFromExtremes(
  shouldDrawVertically,
  transform,
  extremes: Array<GridIntersection>
): CurvesKit {
  var curves: Array<BezierStep> = [];
  var transformedStart: Pt = transform.apply(extremes[0].pt);
  for (var i = 1; i < extremes.length; ++i) {
    let dest: Pt = transform.apply(extremes[i].pt);
    let src: Pt = transform.apply(extremes[i - 1].pt);

    let distToPrev = dest[0] - src[0];
    if (shouldDrawVertically) {
      distToPrev = dest[1] - src[1];
    }
    var srcCtrl: Pt = [src[0] + distToPrev / 2, src[1]];
    var destCtrl: Pt = [dest[0] - distToPrev / 2, dest[1]];
    if (shouldDrawVertically) {
      srcCtrl = [src[0], src[1] + distToPrev / 2];
      destCtrl = [dest[0], dest[1] - distToPrev / 2];
    }

    // This is the order that the params for bezierCurveTo go in.
    curves.push({ srcCtrl, destCtrl, dest });
  }
  return { start: transformedStart, curves };
}

function drawIntersections({
  grid,
  imageContext,
  transform,
  playerGridId
}: {
  grid: Grid;
  imageContext;
  transform;
  playerGridId: string;
}) {
  var radius = playerGridId === grid.id ? 8 : 4;
  imageContext.fillStyle = grid.color;
  imageContext.beginPath();
  applyToPointsInRows(
    grid.rows,
    curry(drawIntersectionCircle)(imageContext, transform, radius)
  );
  imageContext.fill();
}

function drawIntersectionCircle(
  imageContext,
  transform,
  radius: number,
  intersection: GridIntersection
) {
  var transformedPt: Pt = transform.apply(intersection.pt);
  imageContext.moveTo.apply(imageContext, transformedPt);
  imageContext.arc(transformedPt[0], transformedPt[1], radius, 0, Math.PI * 2);
}

module.exports = renderGrid;
