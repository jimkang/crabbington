var d3 = require('d3-selection');
var curry = require('lodash.curry');
var renderGrid = require('./render-grid');
var renderSoul = require('./render-soul');
var renderBlast = require('./render-blast');
var renderUI = require('./render-ui');
var Zoom = require('d3-zoom');
var callNextTick = require('call-next-tick');

import { renderMessage } from './render-message';
import { renderAnimations } from './render-animations';

import { Soul, GameState } from '../types';

// Get the various DOM roots.
var canvasesContainer = d3.select('#canvases-container');
var imageBoard = d3.select('#image-board');
var uiBoard = d3.select('#ui-board');
var inputBoard = d3.select('#input-board');
// var labelLayer = d3.select('#labels-layer');
var imageContext = imageBoard.node().getContext('2d', { alpha: false });

var lastGameState: GameState;
var currentTransform = Zoom.zoomIdentity;
// If changing window size means that board size needs to change, consider
// putting this in render();
var { boardWidth, boardHeight } = resizeBoards();

setUpZoom(draw);

function render({
  gameState,
  onAdvance,
  onMessageDismiss,
  onNewGame,
  onFindPlayer,
  shouldWaitForInteraction = true,
  shouldPanToPlayer = false
}: {
  gameState: GameState;
  onAdvance;
  onMessageDismiss: () => void;
  onNewGame: () => void;
  onFindPlayer: () => void;
  shouldWaitForInteraction: boolean;
  shouldPanToPlayer: boolean;
}) {
  lastGameState = gameState;

  if (gameState.animations.length > 0) {
    // Stop rendering and taking input normally. Instead, run all of the animations
    // and their postAnimationGameStateUpdaters before returning to normal.
    renderAnimations({ gameState, onAdvance, draw });
    return;
  }

  if (shouldPanToPlayer) {
    panToPlayer();
  }

  draw();
  // Test.
  // imageContext.strokeStyle = 'green';
  // imageContext.beginPath();
  // imageContext.moveTo(0, probable.roll(800));
  // imageContext.lineTo(800, probable.roll(800));
  // imageContext.stroke();

  inputBoard.on('click.input', null);
  inputBoard.on('click.input', onInputBoardClick);

  renderUI({ gameState, onAdvance, onNewGame, onFindPlayer });
  renderMessage({ message: gameState.displayMessage, onMessageDismiss });

  if (!shouldWaitForInteraction) {
    callNextTick(onAdvance, { gameState });
  }

  function onInputBoardClick() {
    // Undo the zoom transforms before sending the clicks on.
    var recentClickX = currentTransform.invertX(d3.event.layerX);
    var recentClickY = currentTransform.invertY(d3.event.layerY);
    onAdvance({ gameState, recentClickX, recentClickY });
  }

  function panToPlayer() {
    // currentTransform has a translate() method.
    // Zoom.zoomIdentity has methods that can be used to create a new transform.
    // How do I set the transform on a behavior?
    var transform = Zoom.zoomIdentity.scale(2).translate(1, 1);
    setUpZoom(draw, transform);
  }
}

function draw() {
  imageContext.clearRect(0, 0, boardWidth, boardHeight);
  var player: Soul = lastGameState.player;
  lastGameState.grids.forEach(
    curry(renderGrid)({
      imageContext,
      transform: currentTransform,
      playerGridId: player.gridContext.id
    })
  );
  lastGameState.soulTracker
    .getSouls()
    .forEach(curry(renderSoul)({ imageContext, transform: currentTransform }));
  lastGameState.ephemerals.blasts.forEach(
    curry(renderBlast)({ imageContext, transform: currentTransform })
  );
}

function resizeBoards() {
  var boardWidth = document.body.getBoundingClientRect().width;
  var boardHeight = document.body.getBoundingClientRect().height;
  if (boardHeight < 400) {
    boardHeight = boardWidth;
  }

  canvasesContainer.style('width', boardWidth);
  canvasesContainer.style('height', boardHeight);
  imageBoard.attr('width', boardWidth);
  imageBoard.attr('height', boardHeight);
  uiBoard.style('width', boardWidth);
  // Don't set uiBoard height. It should only be as tall as the viewport.
  //uiBoard.style('height', boardHeight);
  inputBoard.attr('width', boardWidth);
  inputBoard.attr('height', boardHeight);

  return { boardWidth, boardHeight };
}

function setUpZoom(draw, initialTransform = undefined) {
  var zoom = Zoom.zoom()
    .scaleExtent([0.03, 2])
    .on('zoom', zoomed);

  inputBoard.call(zoom);

  if (initialTransform) {
    inputBoard.call(zoom.transform, initialTransform);
  }

  function zoomed() {
    // Warning: This is a reference. Is d3 going to change it unexpectedly?
    currentTransform = d3.event.transform;
    //console.log('transform', currentTransform);
    draw(currentTransform);
  }
}

module.exports = render;
