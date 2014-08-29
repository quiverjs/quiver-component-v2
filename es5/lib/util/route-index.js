"use strict";
Object.defineProperties(exports, {
  createRouteIndex: {get: function() {
      return createRouteIndex;
    }},
  __esModule: {value: true}
});
var streamToHttpHandler = $traceurRuntime.assertObject(require('quiver-http')).streamToHttpHandler;
var getStreamHandler = (function(handleable) {
  return handleable.streamHandler;
});
var getHttpHandler = (function(handleable) {
  var $__0 = $traceurRuntime.assertObject(handleable),
      httpHandler = $__0.httpHandler,
      streamHandler = $__0.streamHandler;
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
