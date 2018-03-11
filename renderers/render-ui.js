var d3 = require('d3-selection');

// Get the various DOM roots.
// var uiBoard = d3.select('#ui-board');
var controlsLayer = d3.select('#controls-layer');
var blastButton = d3.select('#blast-button');

var playerCommandQueue = [];
var concludeUI;
blastButton.on('click.blast', onBlastClick);

function onBlastClick() {
  playerCommandQueue.push({ cmdType: 'blast' });
  concludeUI();
}

function renderUI({ gameState, onAdvance }) {
  playerCommandQueue.length = 0;

  controlsLayer.classed('hidden', !gameState.uiOn);
  concludeUI = function advanceWithCommands() {
    gameState.uiOn = false;
    onAdvance({ gameState, commands: playerCommandQueue });
  };
}

module.exports = renderUI;
