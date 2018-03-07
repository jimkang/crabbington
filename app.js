var RouteState = require('route-state');
var handleError = require('handle-error-web');
var update = require('./flows/update');
var render = require('./renderers/render');

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
  advance({gameState: theGameState});
}

function advance({gameState}) {
  update({gameState});
  render({gameState, onAdvance: advance});
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}
