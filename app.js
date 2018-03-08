var RouteState = require('route-state');
var handleError = require('handle-error-web');
var update = require('./flows/update');
var render = require('./renderers/render');
var probable = require('probable'); // TODO: Use seed

var theGameState = {
  grids: require('./defs/grid-defs'),
  souls: require('./defs/soul-defs')
};

var routeState = RouteState({
  followRoute,
  windowObject: window
});

(function go() {
  window.onerror = reportTopLevelError;
  routeState.routeFromHash();
})();

function followRoute(routeDict) {
  advance({ gameState: theGameState });
}

function advance({ gameState, recentClickX, recentClickY }) {
  update({ gameState, recentClickX, recentClickY });
  render({ gameState, onAdvance: advance, probable });
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}
