var RouteState = require('route-state');
var handleError = require('handle-error-web');
var update = require('./flows/update');
var render = require('./renderers/render');
var probable = require('probable'); // TODO: Use seed
var findWhere = require('lodash.findwhere');
var generateGrids = require('./generators/generate-grids');
var generateSouls = require('./generators/generate-souls');

var theGameState = {};

var routeState = RouteState({
  followRoute,
  windowObject: window
});

(function go() {
  window.onerror = reportTopLevelError;
  routeState.routeFromHash();
})();

function followRoute(routeDict) {
  // TODO: Create probable with seed.
  theGameState.grids = generateGrids({ probable });
  theGameState.souls = generateSouls({ probable, grids: theGameState.grids });
  theGameState.player = findWhere(theGameState.souls, { id: 'player' });

  advance({ gameState: theGameState });
}

function advance({ gameState, recentClickX, recentClickY, commands }) {
  update({ gameState, recentClickX, recentClickY, commands, probable });
  render({ gameState, onAdvance: advance });
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}
