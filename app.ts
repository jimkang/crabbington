var RouteState = require('route-state');
var handleError = require('handle-error-web');
var update = require('./flows/update');
var render = require('./renderers/render');
var Probable = require('probable').createProbable;
var findWhere = require('lodash.findwhere');
var generateGrids = require('./generators/generate-grids');
var generateSouls = require('./generators/generate-souls');
var seedrandom = require('seedrandom');
var { version } = require('./package.json');

import { GameState, Command, TargetTree } from './types';
import { createTargetTree } from './target-tree';
import { init } from './flows/init';

var randomid = require('@jimkang/randomid')();

var theGameState: GameState = {
  allowAdvance: true,
  animations: [],
  ephemerals: {
    blasts: []
  },
  gridsInit: false,
  uiOn: false,
  cmdChoices: [],
  lastClickedThingIds: [],
  gameWon: false,
  souls: [],
  currentActingSoulIndex: undefined,
  turn: 0
};

var targetTree: TargetTree = createTargetTree();

var routeState = RouteState({
  followRoute,
  windowObject: window
});

(function go() {
  window.onerror = reportTopLevelError;
  renderVersion();
  routeState.routeFromHash();
})();

function followRoute({ seed }) {
  if (!seed) {
    routeState.addToRoute({ seed: randomid(8) });
    return;
  }
  var random = seedrandom(seed);
  var probable = Probable({ random });
  theGameState.grids = generateGrids({ probable, random });
  theGameState.souls = generateSouls({ random, grids: theGameState.grids });
  theGameState.player = findWhere(theGameState.souls, { id: 'player' });
  init(theGameState, targetTree);
  incrementActorIndex(theGameState);

  advance({ gameState: theGameState });

  function advance({
    gameState,
    recentClickX,
    recentClickY,
    commands
  }: {
    gameState: GameState;
    recentClickX?: number;
    recentClickY?: number;
    commands?: Array<Command>;
  }) {
    incrementTurn(gameState);
    if (gameState.allowAdvance) {
      resetGameStateForNewTurn(gameState);
      update(
        {
          actor: getActingSoul(gameState),
          gameState,
          recentClickX,
          recentClickY,
          commands,
          probable,
          targetTree
        },
        onUpdateDone
      );
    }
    function onUpdateDone(
      error: Error,
      {
        shouldAdvanceToNextSoul,
        renderShouldWaitToAdvanceToNextUpdate
      }: {
        shouldAdvanceToNextSoul: boolean;
        renderShouldWaitToAdvanceToNextUpdate: boolean;
      }
    ) {
      console.log(getActingSoul(gameState).id, 'update done.');
      if (error) {
        handleError(error);
      } else if (shouldAdvanceToNextSoul) {
        incrementActorIndex(gameState);
      }
      // Try to keep going even if there is an error.
      render({
        gameState,
        onMessageDismiss,
        onAdvance: advance,
        shouldWaitForInteraction: renderShouldWaitToAdvanceToNextUpdate
      });
    }
  }
}

// Once it's displayed, get rid of it.
function onMessageDismiss() {
  theGameState.displayMessage = '';
}

function resetGameStateForNewTurn(gameState: GameState) {
  gameState.cmdChoices.length = 0;
}

function incrementActorIndex(gameState: GameState) {
  if (gameState.currentActingSoulIndex === undefined) {
    gameState.currentActingSoulIndex = gameState.souls.findIndex(
      soul => soul.id === gameState.player.id
    );
  } else {
    gameState.currentActingSoulIndex += 1;
  }
  if (gameState.currentActingSoulIndex >= gameState.souls.length) {
    gameState.currentActingSoulIndex = 0;
  }
}

function getActingSoul(gameState: GameState) {
  return gameState.souls[gameState.currentActingSoulIndex];
}

function incrementTurn(gameState: GameState) {
  gameState.turn += 1;
  console.log('Advancing to turn', gameState.turn);
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info');
  versionInfo.textContent = version;
}
