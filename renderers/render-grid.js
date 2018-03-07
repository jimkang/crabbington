function renderGrid(
  { imageContext, inputContext, boardWidth, boardHeight },
  grid
) {
  imageContext.strokeStyle = grid.color;
  imageContext.beginPath();

  // Vertical lines.
  for (var x = grid.xOffset; x <= boardWidth; x += grid.xSpace) {
    imageContext.moveTo(x, 0);
    imageContext.lineTo(x, boardHeight);
  }
  // Horizontal lines.
  for (var y = grid.yOffset; y <= boardHeight; y += grid.ySpace) {
    imageContext.moveTo(0, y);
    imageContext.lineTo(boardWidth, y);
  }
  imageContext.stroke();

  // What should be rendered onto inputContext? Circles at intersections?
}

module.exports = renderGrid;
