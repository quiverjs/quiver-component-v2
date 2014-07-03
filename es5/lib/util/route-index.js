"use strict";
Object.defineProperties(exports, {
  createRouteIndex: {get: function() {
      return createRouteIndex;
    }},
  __esModule: {value: true}
});
var createHandlerRouteIndex = (function(handlerKey) {
  var routeIndex = {
    staticRoutes: {},
    dynamicRoutes: []
  };
  var addStaticRoute = (function(path, handleable) {
    var handler = handleable[handlerKey];
    if (handler) {
      routeIndex.staticRoutes[path] = handler;
    }
  });
  var addDynamicRoute = (function(matcher, handleable) {
    var handler = handleable[handlerKey];
    if (handler) {
      routeIndex.dynamicRoutes.push({
        matcher: matcher,
        handler: handler
      });
    }
  });
  var setDefaultRoute = (function(handleable) {
    var handler = handleable[handlerKey];
    if (handler) {
      routeIndex.defaultRoute = handler;
    }
  });
  return {
    addStaticRoute: addStaticRoute,
    addDynamicRoute: addDynamicRoute,
    setDefaultRoute: setDefaultRoute,
    routeIndex: routeIndex
  };
});
var createRouteIndex = (function() {
  var stream = createHandlerRouteIndex('streamHandler');
  var http = createHandlerRouteIndex('httpHandler');
  var addStaticRoute = (function(path, handleable) {
    stream.addStaticRoute(path, handleable);
    http.addStaticRoute(path, handleable);
  });
  var addDynamicRoute = (function(matcher, handleable) {
    stream.addDynamicRoute(matcher, handleable);
    http.addDynamicRoute(matcher, handleable);
  });
  var setDefaultRoute = (function(handleable) {
    stream.setDefaultRoute(handleable);
    http.setDefaultRoute(handleable);
  });
  return {
    addStaticRoute: addStaticRoute,
    addDynamicRoute: addDynamicRoute,
    setDefaultRoute: setDefaultRoute,
    stream: stream,
    http: http
  };
});
