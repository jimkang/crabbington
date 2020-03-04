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

  var actionButtons = buttonRoot
    .selectAll('.action-button')
    .data(gameState.actionChoices, accessor('identity'));
  actionButtons.exit().remove();
  actionButtons
    .enter()
    .append('button')
    .classed('action-button', true)
    .classed('clickable', true)
    .merge(actionButtons)
    .text(accessor('identity'))
    .on('click', onClickAction);

  console.log('actionChoices', gameState.actionChoices);
  controlsLayer.classed('hidden', !gameState.uiOn);

  function onClickAction(action: string) {
    playerCommandQueue.push({ cmdType: action });
    concludeUI();
  }

  concludeUI = function advanceWithCommands() {
    gameState.uiOn = false;
    onAdvance({ gameState, commands: playerCommandQueue });
  };

  // Hidden by default so that it can't be clicked before
  // the JS is loaded.
  closeHelpButton.classed('hidden', false);
}

module.exports = renderUI;
