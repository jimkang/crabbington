var d3 = require('d3-selection');
var curry = require('lodash.curry');
var renderGrid = require('./render-grid');
var renderSoul = require('./render-soul');

const widthLimit = 800;

// Get the various DOM roots.
var canvasesContainer = d3.select('#canvases-container');
var imageBoard = d3.select('#image-board');
var uiBoard = d3.select('#ui-board');
// var labelLayer = d3.select('#labels-layer');
var imageContext = imageBoard.node().getContext('2d', { alpha: false });

function render({ gameState, onAdvance, probable }) {
  // Does this have to get called every time?
  var { boardWidth, boardHeight } = resizeBoards();

  imageContext.clearRect(0, 0, boardWidth, boardWidth);
  gameState.grids.forEach(
    curry(renderGrid)({
      imageContext,
      probable
    })
  );
  gameState.souls.forEach(curry(renderSoul)({ imageContext }));

  // Test.
  // imageContext.strokeStyle = 'green';
  // imageContext.beginPath();
  // imageContext.moveTo(0, probable.roll(800));
  // imageContext.lineTo(800, probable.roll(800));
  // imageContext.stroke();

  imageBoard.on('click.input', null);
  imageBoard.on('click.input', onBoardClick);

  function onBoardClick() {
    var recentClickX = d3.event.layerX;
    var recentClickY = d3.event.layerY;
    onAdvance({ gameState, recentClickX, recentClickY });
  }
}

function resizeBoards() {
  var boardWidth = document.body.getBoundingClientRect().width;

  if (boardWidth > widthLimit) {
    boardWidth = widthLimit;
  }
  // TODO: Something other than square if necessary.
  var boardHeight = boardWidth;

  canvasesContainer.style('width', boardWidth);
  canvasesContainer.style('height', boardHeight);
  imageBoard.attr('width', boardWidth);
  imageBoard.attr('height', boardHeight);
  uiBoard.attr('width', boardWidth);
  uiBoard.attr('height', boardHeight);

  return { boardWidth, boardHeight };
}

module.exports = render;
