var RouteState = require('route-state');
var handleError = require('handle-error-web');
var update = require('./flows/update');
var render = require('./renderers/render');
var Probable = require('probable').createProbable;
var findWhere = require('lodash.findwhere');
var generateGrids = require('./generators/generate-grids');
var generateSouls = require('./generators/generate-souls');
var seedrandom = require('seedrandom');

var randomid = require('@jimkang/randomid')();

var theGameState = {
  allowAdvance: true,
  animations: [],
  ephemerals: {
    blasts: []
  },
  gridsInit: false
};

var routeState = RouteState({
  followRoute,
  windowObject: window
});

(function go() {
  window.onerror = reportTopLevelError;
  routeState.routeFromHash();
})();

function followRoute({ seed }) {
  if (!seed) {
    routeState.addToRoute({ seed: randomid(8) });
    return;
  }
  var random = seedrandom(seed);
  var probable = Probable({ random });
  theGameState.grids = generateGrids({ probable });
  theGameState.souls = generateSouls({ random, grids: theGameState.grids });
  theGameState.player = findWhere(theGameState.souls, { id: 'player' });

  advance({ gameState: theGameState });

  function advance({ gameState, recentClickX, recentClickY, commands }) {
    if (gameState.allowAdvance) {
      update({
        gameState,
        recentClickX,
        recentClickY,
        commands,
        probable
      });
      render({ gameState, onAdvance: advance });
    }
  }
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}
