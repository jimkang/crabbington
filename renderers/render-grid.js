var curry = require('lodash.curry');
var effects = require('../grid-effects/grid-effects');

function renderGrid(
  { imageContext, inputContext, boardWidth, boardHeight, probable },
  grid
) {
  var rows = getIntersectionRows(grid, boardWidth, boardHeight, probable);
  if (grid.effects) {
    grid.effects.forEach(applyEffect);
  }

  var cols = rowsToCols(rows);
  console.log(rows);
  console.log(cols);

  var horizontalBezierCurvesPerLine = rows.map(
    curry(curvesFromExtremes)(false)
  );
  var verticalBezierCurvesPerLine = cols.map(curry(curvesFromExtremes)(true));
  console.log('horizontalBezierCurvesPerLine', horizontalBezierCurvesPerLine);
  console.log('verticalBezierCurvesPerLine', verticalBezierCurvesPerLine);

  var drawC = curry(drawCurve)(imageContext);

  imageContext.strokeStyle = grid.color;
  imageContext.beginPath();

  horizontalBezierCurvesPerLine.forEach(drawLineCurves);
  verticalBezierCurvesPerLine.forEach(drawLineCurves);

  imageContext.stroke();

  // What should be rendered onto inputContext? Circles at intersections?

  function drawLineCurves(curvesKit) {
    imageContext.moveTo.apply(imageContext, curvesKit.start);
    curvesKit.curves.forEach(drawC);
  }

  function applyEffect(effect) {
    rows = effects[effect.name](effect, rows);
  }
}

function drawCurve(ctx, curveParams) {
  ctx.bezierCurveTo.apply(ctx, curveParams);
}

function getIntersectionRows(grid, boardWidth, boardHeight, probable) {
  var rows = [];
  for (var y = grid.yOffset; y <= boardHeight; y += grid.ySpace) {
    let row = [];
    for (var x = grid.xOffset; x <= boardWidth; x += grid.xSpace) {
      row.push([x, y]);
      // Random warp:
      // row.push([x + (-20 + probable.roll(40)), y + (-20 + probable.roll(40))])
    }
    rows.push(row);
  }

  // TODO: Warping and/or transforms on points.
  return rows;
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

function getVerticalPath(col) {
  // TODO: Transforms? Interpolation?
  return col;
}

function getHorizontalPath(row) {
  // TODO: Transforms? Interpolation?
  return row;
}

// Assumes extremes are sorted, ascending.
function curvesFromExtremes(vertical, extremes) {
  var curves = [];
  for (var i = 1; i < extremes.length; ++i) {
    let dest = extremes[i];
    let src = extremes[i - 1];
    let distToPrev = dest[0] - src[0];
    if (vertical) {
      distToPrev = dest[1] - src[1];
    }
    var srcCtrlX = src[0] + distToPrev / 2;
    var srcCtrlY = src[1];
    var destCtrlX = dest[0] - distToPrev / 2;
    var destCtrlY = dest[1];
    if (vertical) {
      srcCtrlX = src[0];
      srcCtrlY = src[1] + distToPrev / 2;
      destCtrlX = dest[0];
      destCtrlY = dest[1] - distToPrev / 2;
    }

    // This is the order that the params for bezierCurveTo go in.
    curves.push([srcCtrlX, srcCtrlY, destCtrlX, destCtrlY, dest[0], dest[1]]);
  }
  return { start: extremes[0], curves };
}

module.exports = renderGrid;
