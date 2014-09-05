"use strict";
Object.defineProperties(exports, {
  createRouteIndex: {get: function() {
      return createRouteIndex;
    }},
  __esModule: {value: true}
});
var $__quiver_45_http__;
var streamToHttpHandler = ($__quiver_45_http__ = require("quiver-http"), $__quiver_45_http__ && $__quiver_45_http__.__esModule && $__quiver_45_http__ || {default: $__quiver_45_http__}).streamToHttpHandler;
var getStreamHandler = (function(handleable) {
  return handleable.streamHandler;
});
var getHttpHandler = (function(handleable) {
  var $__1 = handleable,
      httpHandler = $__1.httpHandler,
      streamHandler = $__1.streamHandler;
  if (httpHandler)
    return httpHandler;
  if (streamHandler)
    return streamToHttpHandler(streamHandler);
  return null;
});
var createHandlerRouteIndex = (function(getHandler) {
  var routeIndex = {
    staticRoutes: {},
    dynamicRoutes: []
  };
  var addStaticRoute = (function(path, handleable) {
    var handler = getHandler(handleable);
    if (handler) {
      routeIndex.staticRoutes[path] = handler;
    }
  });
  var addDynamicRoute = (function(matcher, handleable) {
    var handler = getHandler(handleable);
    if (handler) {
      routeIndex.dynamicRoutes.push({
        matcher: matcher,
        handler: handler
      });
    }
  });
  var setDefaultRoute = (function(handleable) {
    var handler = getHandler(handleable);
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
  var stream = createHandlerRouteIndex(getStreamHandler);
  var http = createHandlerRouteIndex(getHttpHandler);
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
