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
      color: 'red',
      effects: [
        {
          name: 'gravityWarp',
          centers: [[300, 300]],
          strength: 16, // How far it pulls a point at strongest gravity.
          decayDist: 288 // At what point gravity fades completely.
        },
        {
          name: 'gravityWarp',
          centers: [[500, 100], [400, 700]],
          strength: 64, // How far it pulls a point at strongest gravity.
          decayDist: 192 // At what point gravity fades completely.
        }
      ]
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
