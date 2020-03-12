var RouteState = require('route-state');
var handleError = require('handle-error-web');
var render = require('./renderers/render');
var Probable = require('probable').createProbable;
var findWhere = require('lodash.findwhere');
var generateGrids = require('./generators/generate-grids');
var generateSouls = require('./generators/generate-souls');
var seedrandom = require('seedrandom');
var { version } = require('./package.json');

import { update } from './flows/update';
import { GameState, TargetTree, UpdateResult, Soul } from './types';
import { createTargetTree } from './target-tree';
import { init } from './flows/init';
import { createSoulTracker } from './ops/soul-tracker';

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
  cmdQueue: [],
  lastClickedThingIds: [],
  gameWon: false,
  deathNoticeSent: false,
  soulTracker: createSoulTracker(),
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
  theGameState.soulTracker.addSouls(
    theGameState.grids,
    targetTree,
    generateSouls({ random, grids: theGameState.grids })
  );
  theGameState.player = findWhere(theGameState.soulTracker.getSouls(), {
    id: 'player'
  });
  init(theGameState, targetTree);
  theGameState.soulTracker.setActingSoul('player');

  // On first advance and render, move the camera to the player.
  advance({ gameState: theGameState, shouldMoveFocusToPlayer: true });

  function advance({
    gameState,
    recentClickX,
    recentClickY,
    shouldMoveFocusToPlayer = false
  }: {
    gameState: GameState;
    recentClickX?: number;
    recentClickY?: number;
    shouldMoveFocusToPlayer?: boolean;
  }) {
    incrementTurn(gameState);
    if (!gameState.allowAdvance) {
      return;
    }

    let actor: Soul = gameState.soulTracker.getActingSoul();
    let {
      shouldAdvanceToNextSoul,
      renderShouldWaitToAdvanceToNextUpdate
    }: UpdateResult = update({
      actor,
      gameState,
      recentClickX,
      recentClickY,
      probable,
      targetTree
    });
    //console.log(actor.id, 'update done.');
    if (shouldAdvanceToNextSoul) {
      gameState.soulTracker.incrementActorIndex();
    }

    if (shouldMoveFocusToPlayer) {
      findPlayer();
    } else {
      window.requestAnimationFrame(callRender);
    }

    function callRender(overrides = {}) {
      render(
        Object.assign(
          {
            gameState,
            onMessageDismiss,
            onAdvance: advance,
            onNewGame: restartGame,
            onFindPlayer: findPlayer,
            shouldWaitForInteraction: renderShouldWaitToAdvanceToNextUpdate
          },
          overrides
        )
      );
    }

    function findPlayer() {
      callRender({ soulToFocusOn: gameState.player });
    }
  }
}

function restartGame() {
  theGameState.allowAdvance = true;
  theGameState.animations = [];
  theGameState.ephemerals = { blasts: [] };
  theGameState.gridsInit = false;
  theGameState.uiOn = false;
  theGameState.cmdChoices.length = 0;
  theGameState.cmdQueue.length = 0;
  theGameState.lastClickedThingIds.length = 0;
  theGameState.gameWon = false;
  theGameState.deathNoticeSent = false;
  theGameState.turn = 0;

  theGameState.soulTracker.removeSouls(
    targetTree,
    theGameState.soulTracker.getSouls()
  );

  routeState.removeFromRoute('seed');
}

// Once it's displayed, get rid of it.
function onMessageDismiss() {
  theGameState.displayMessage = '';
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
