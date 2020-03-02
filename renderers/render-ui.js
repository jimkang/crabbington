var d3 = require('d3-selection');

// Get the various DOM roots.
// var uiBoard = d3.select('#ui-board');
var controlsLayer = d3.select('#controls-layer');
var blastButton = d3.select('#blast-button');
var helpLayer = d3.select('#help-layer');
var closeHelpButton = d3.select('#close-help-button');
var openHelpButton = d3.select('#open-help-button');

var playerCommandQueue = [];
var concludeUI;
blastButton.on('click.blast', onBlastClick);
closeHelpButton.on('click.close-help', onCloseHelpClick);
openHelpButton.on('click.open-help', onOpenHelpClick);

function onBlastClick() {
  playerCommandQueue.push({ cmdType: 'blast' });
  concludeUI();
}

function onCloseHelpClick() {
  helpLayer.classed('hidden', true);
  openHelpButton.classed('hidden', false);
  concludeUI();
}

function onOpenHelpClick() {
  helpLayer.classed('hidden', false);
  openHelpButton.classed('hidden', true);
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
