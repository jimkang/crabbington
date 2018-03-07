var d3 = require('d3-selection');
// var callNextTick = require('call-next-tick');

const widthLimit = 800;

// Get the various DOM roots.

var canvasesContainer = d3.select('#canvases-container');
var imageBoard = d3.select('#image-board');
var inputBoard = d3.select('#input-board');
var textBoard = d3.select('#text-board');
// var labelLayer = d3.select('#labels-layer');
var imageContext = imageBoard.node().getContext('2d', { alpha: false });
var inputContext = inputBoard.node().getContext('2d', { alpha: false });

function render({gameState, onAdvance, probable}) {
  // Does this have to get called every time?
  resizeBoards();

  imageContext.strokeStyle = 'green';
  imageContext.beginPath();
  imageContext.moveTo(0, probable.roll(800));
  imageContext.lineTo(800, probable.roll(800));
  imageContext.stroke();

  inputBoard.on('click.input', null);
  inputBoard.on('click.input', onInputBoardClick);

  function onInputBoardClick() {
    var mouseX = d3.event.layerX;
    var mouseY = d3.event.layerY;

    var imageData = inputContext.getImageData(mouseX, mouseY, 1, 1)
      .data;
    // var cell = trackingColorer.getCellForImageData(imageData);
    // Temporary:
    onAdvance({gameState});
  }
}

function resizeBoards() {
  var width = document.body.getBoundingClientRect().width;

  if (width > widthLimit) {
    width = widthLimit;
  }
  // TODO: Something other than square if necessary.
  var height = width;

  canvasesContainer.style('width', width);
  canvasesContainer.style('height', height);
  imageBoard.attr('width', width);
  imageBoard.attr('height', height);
  textBoard.attr('width', width);
  textBoard.attr('height', height);
  inputBoard.attr('width', width);
  inputBoard.attr('height', height);
}

module.exports = render;
