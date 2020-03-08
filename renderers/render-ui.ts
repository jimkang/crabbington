var d3 = require('d3-selection');
var accessor = require('accessor');

import { Command, GameState } from '../types';

// Get the various DOM roots.
// var uiBoard = d3.select('#ui-board');
var controlsLayer = d3.select('#controls-layer');
var helpLayer = d3.select('#help-layer');
var closeHelpButton = d3.select('#close-help-button');
var openHelpButton = d3.select('#open-help-button');
var buttonRoot = controlsLayer.select('.button-list');

var playerCommandQueue: Array<Command> = [];
var concludeUI;
closeHelpButton.on('click.close-help', onCloseHelpClick);
openHelpButton.on('click.open-help', onOpenHelpClick);

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

function renderUI({
  gameState,
  onAdvance
}: {
  gameState: GameState;
  onAdvance;
}) {
  playerCommandQueue.length = 0;

  // Should the key actually be a new id prop?
  var actionButtons = buttonRoot
    .selectAll('.action-button')
    .data(gameState.cmdChoices, accessor());
  actionButtons.exit().remove();
  actionButtons
    .enter()
    .append('button')
    .classed('action-button', true)
    .classed('clickable', true)
    .merge(actionButtons)
    .text(accessor('name'))
    .on('click', onClickChoice);

  console.log('cmdChoices', gameState.cmdChoices);
  controlsLayer.classed('hidden', !gameState.uiOn);

  function onClickChoice(cmd: Command) {
    playerCommandQueue.push(cmd);
    concludeUI();
  }

  concludeUI = function advanceWithCommands() {
    gameState.uiOn = false;
    gameState.cmdQueue = playerCommandQueue;
    onAdvance({ gameState });
  };

  // Hidden by default so that it can't be clicked before
  // the JS is loaded.
  closeHelpButton.classed('hidden', false);
}

module.exports = renderUI;
