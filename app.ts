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

import { GameState, Command } from './types';

var randomid = require('@jimkang/randomid')();

var theGameState: GameState = {
  allowAdvance: true,
  animations: [],
  ephemerals: {
    blasts: []
  },
  gridsInit: false,
  uiOn: false,
  actionChoices: [],
  lastClickedThingIds: [],
  gameWon: false
};

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
    if (gameState.allowAdvance) {
      update({
        gameState,
        recentClickX,
        recentClickY,
        commands,
        probable
      });
      render({ gameState, onMessageDismiss, onAdvance: advance });
    }
  }
}

// Once it's displayed, get rid of it.
function onMessageDismiss() {
  theGameState.displayMessage = '';
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info');
  versionInfo.textContent = version;
}
