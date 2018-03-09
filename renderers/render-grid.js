var curry = require('lodash.curry');
var applyToPointsInRows = require('../apply-to-points-in-rows');

function renderGrid({ imageContext, transform }, grid) {
  drawGridLines({ grid, imageContext, transform });
  drawIntersections({ grid, imageContext, transform });
}

function drawGridLines({ grid, imageContext, transform }) {
  var cols = rowsToCols(grid.rows);

  var horizontalBezierCurvesPerLine = grid.rows.map(
    curry(curvesFromExtremes)(false, transform)
  );
  var verticalBezierCurvesPerLine = cols.map(
    curry(curvesFromExtremes)(true, transform)
  );
  // console.log('horizontalBezierCurvesPerLine', horizontalBezierCurvesPerLine);
  // console.log('verticalBezierCurvesPerLine', verticalBezierCurvesPerLine);

  var drawC = curry(drawCurve)(imageContext);

  imageContext.strokeStyle = grid.color;
  imageContext.beginPath();

  horizontalBezierCurvesPerLine.forEach(drawLineCurves);
  verticalBezierCurvesPerLine.forEach(drawLineCurves);

  imageContext.stroke();

  // What should be rendered onto inputContext? Circles at intersections?

  function drawLineCurves(curvesKit) {
    imageContext.moveTo(
      transform.applyX(curvesKit.start.x),
      transform.applyY(curvesKit.start.y)
    );

    curvesKit.curves.forEach(drawC);
  }
}

function drawCurve(ctx, curveParams) {
  ctx.bezierCurveTo.apply(ctx, curveParams);
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
function curvesFromExtremes(shouldDrawVertically, transform, extremes) {
  var curves = [];
  var transformedStart = {
    x: transform.applyX(extremes[0].x),
    y: transform.applyX(extremes[0].y)
  };
  for (var i = 1; i < extremes.length; ++i) {
    let dest = extremes[i];
    let src = extremes[i - 1];
    let distToPrev = dest.x - src.x;
    if (shouldDrawVertically) {
      distToPrev = dest.y - src.y;
    }
    var srcCtrlX = src.x + distToPrev / 2;
    var srcCtrlY = src.y;
    var destCtrlX = dest.x - distToPrev / 2;
    var destCtrlY = dest.y;
    if (shouldDrawVertically) {
      srcCtrlX = src.x;
      srcCtrlY = src.y + distToPrev / 2;
      destCtrlX = dest.x;
      destCtrlY = dest.y - distToPrev / 2;
    }

    // This is the order that the params for bezierCurveTo go in.
    curves.push([
      transform.applyX(srcCtrlX),
      transform.applyY(srcCtrlY),
      transform.applyX(destCtrlX),
      transform.applyY(destCtrlY),
      transform.applyX(dest.x),
      transform.applyY(dest.y)
    ]);
  }
  return { start: transformedStart, curves };
}

function drawIntersections({ grid, imageContext, transform }) {
  imageContext.fillStyle = grid.color;
  imageContext.beginPath();
  applyToPointsInRows(
    grid.rows,
    curry(drawIntersectionCircle)(imageContext, transform)
  );
  imageContext.fill();
}

function drawIntersectionCircle(imageContext, transform, point) {
  var x = transform.applyX(point.x);
  var y = transform.applyY(point.y);
  imageContext.moveTo(x, y);
  imageContext.arc(x, y, 4, 0, Math.PI * 2);
}

module.exports = renderGrid;
