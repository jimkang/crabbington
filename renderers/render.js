var d3 = require('d3-selection');
var curry = require('lodash.curry');
var renderGrid = require('./render-grid');
var renderSoul = require('./render-soul');
var Zoom = require('d3-zoom');

const widthLimit = 800;

// Get the various DOM roots.
var canvasesContainer = d3.select('#canvases-container');
var imageBoard = d3.select('#image-board');
var uiBoard = d3.select('#ui-board');
var inputBoard = d3.select('#input-board');
// var labelLayer = d3.select('#labels-layer');
var imageContext = imageBoard.node().getContext('2d', { alpha: false });

var lastGameState;
var currentTransform = Zoom.zoomIdentity;
// If changing window size means that board size needs to change, consider
// putting this in render();
var { boardWidth, boardHeight } = resizeBoards();

setUpZoom(draw);

function render({ gameState, onAdvance }) {
  lastGameState = gameState;
  draw(currentTransform);
  // Test.
  // imageContext.strokeStyle = 'green';
  // imageContext.beginPath();
  // imageContext.moveTo(0, probable.roll(800));
  // imageContext.lineTo(800, probable.roll(800));
  // imageContext.stroke();

  inputBoard.on('click.input', null);
  inputBoard.on('click.input', onInputBoardClick);

  function onInputBoardClick() {
    // Undo the zoom transforms before sending the clicks on.
    var recentClickX = currentTransform.invertX(d3.event.layerX);
    var recentClickY = currentTransform.invertY(d3.event.layerY);
    onAdvance({ gameState, recentClickX, recentClickY });
  }
}

function draw(transform) {
  imageContext.clearRect(0, 0, boardWidth, boardHeight);
  lastGameState.grids.forEach(
    curry(renderGrid)({
      imageContext,
      transform,
      playerGridId: lastGameState.player.grid.id
    })
  );
  lastGameState.souls.forEach(curry(renderSoul)({ imageContext, transform }));
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
  inputBoard.attr('width', boardWidth);
  inputBoard.attr('height', boardHeight);

  return { boardWidth, boardHeight };
}

function setUpZoom(draw) {
  var zoom = Zoom.zoom()
    .scaleExtent([0.03, 2])
    .on('zoom', zoomed);

  inputBoard.call(zoom);

  function zoomed() {
    // Warning: This is reference. Is d3 going to change it unexpectedly?
    currentTransform = d3.event.transform;
    console.log('transform', currentTransform);
    draw(currentTransform);
  }
}

module.exports = render;
