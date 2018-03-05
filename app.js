var RouteState = require('route-state');
var handleError = require('handle-error-web');

var routeState = RouteState({
  followRoute: followRoute,
  windowObject: window
});

(function go() {
  window.onerror = reportTopLevelError;
  routeState.routeFromHash();
})();

function followRoute(routeDict) {
  // TODO: Look at the key-value pairs in routeDict and 
  // decide how your app should respond based on that.
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}
