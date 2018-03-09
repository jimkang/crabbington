var curry = require('lodash.curry');
var applyToPointsInRows = require('../apply-to-points-in-rows');

function renderGrid({ imageContext, probable }, grid) {
  drawGridLines({ grid, imageContext });
  drawIntersections({ grid, imageContext });
}

function drawGridLines({ grid, imageContext }) {
  var cols = rowsToCols(grid.rows);

  var horizontalBezierCurvesPerLine = grid.rows.map(
    curry(curvesFromExtremes)(false)
  );
  var verticalBezierCurvesPerLine = cols.map(curry(curvesFromExtremes)(true));
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
    imageContext.moveTo(curvesKit.start.x, curvesKit.start.y);
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
function curvesFromExtremes(vertical, extremes) {
  var curves = [];
  for (var i = 1; i < extremes.length; ++i) {
    let dest = extremes[i];
    let src = extremes[i - 1];
    let distToPrev = dest.x - src.x;
    if (vertical) {
      distToPrev = dest.y - src.y;
    }
    var srcCtrlX = src.x + distToPrev / 2;
    var srcCtrlY = src.y;
    var destCtrlX = dest.x - distToPrev / 2;
    var destCtrlY = dest.y;
    if (vertical) {
      srcCtrlX = src.x;
      srcCtrlY = src.y + distToPrev / 2;
      destCtrlX = dest.x;
      destCtrlY = dest.y - distToPrev / 2;
    }

    // This is the order that the params for bezierCurveTo go in.
    curves.push([srcCtrlX, srcCtrlY, destCtrlX, destCtrlY, dest.x, dest.y]);
  }
  return { start: extremes[0], curves };
}

function drawIntersections({ grid, imageContext }) {
  imageContext.fillStyle = grid.color;
  imageContext.beginPath();
  applyToPointsInRows(grid.rows, curry(drawIntersectionCircle)(imageContext));
  imageContext.fill();
}

function drawIntersectionCircle(imageContext, point) {
  imageContext.moveTo(point.x, point.y);
  imageContext.arc(point.x, point.y, 4, 0, Math.PI * 2);
}

module.exports = renderGrid;
