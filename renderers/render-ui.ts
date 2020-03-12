var d3 = require('d3-selection');
var accessor = require('accessor');

import { Command, GameState } from '../types';

// Get the various DOM roots.
// var uiBoard = d3.select('#ui-board');
var controlsLayer = d3.select('#controls-layer');
var helpLayer = d3.select('#help-layer');
var hudLayer = d3.select('#hud-layer');
var closeHelpButton = d3.select('#close-help-button');
var openHelpButton = d3.select('#open-help-button');
var newGameButton = d3.select('#new-game-button');
var findPlayerButton = d3.select('#find-player-button');
var buttonRoot = controlsLayer.select('.button-list');
var currentHPSpan = hudLayer.select('#current-hp');
var maxHPSpan = hudLayer.select('#max-hp');
var turnLabel = hudLayer.select('.turn-label');

var playerCommandQueue: Array<Command> = [];
var concludeUI;
closeHelpButton.on('click.close-help', onCloseHelpClick);
openHelpButton.on('click.open-help', onOpenHelpClick);

function onCloseHelpClick() {
  helpLayer.classed('hidden', true);
  openHelpButton.classed('hidden', false);
  hudLayer.classed('hidden', false);
  concludeUI();
}

function onOpenHelpClick() {
  helpLayer.classed('hidden', false);
  openHelpButton.classed('hidden', true);
  hudLayer.classed('hidden', true);
  concludeUI();
}

function renderUI({
  gameState,
  onAdvance,
  onNewGame,
  onFindPlayer
}: {
  gameState: GameState;
  onAdvance;
  onNewGame;
  onFindPlayer;
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

  newGameButton.on('click', onNewGame);

  currentHPSpan.text(gameState.player.hp);
  maxHPSpan.text(gameState.player.maxHP);

  findPlayerButton.on('click.find-player', onFindPlayer);

  controlsLayer.classed('hidden', !gameState.uiOn);

  const isPlayerTurn = gameState.soulTracker.getActingSoul().type === 'player';
  turnLabel.text(
    isPlayerTurn ? "It's your turn!" : "It's the other guys' turn!"
  );
  turnLabel.classed('player-turn', isPlayerTurn);

  function onClickChoice(cmd: Command) {
    playerCommandQueue.push(cmd);
    concludeUI();
  }

  concludeUI = function advanceWithCommands() {
    gameState.uiOn = false;
    gameState.cmdQueue = gameState.cmdQueue.concat(playerCommandQueue);
    onAdvance({ gameState });
  };

  // Hidden by default so that it can't be clicked before
  // the JS is loaded.
  closeHelpButton.classed('hidden', false);
}

module.exports = renderUI;
