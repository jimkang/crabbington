var RouteState = require('route-state');
var handleError = require('handle-error-web');
var update = require('./flows/update');
var render = require('./renderers/render');
var probable = require('probable'); // TODO: Use seed

var theGameState = {
  grids: [
    {
      id: 'basic',
      xSpace: 64,
      ySpace: 64,
      xOffset: -32,
      yOffset: -32,
      color: 'blue'
    },
    {
      id: 'other',
      xSpace: 96,
      ySpace: 32,
      xOffset: -16,
      yOffset: 0,
      color: 'red'
    }
  ]
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

function advance({ gameState }) {
  update({ gameState });
  render({ gameState, onAdvance: advance, probable });
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}
