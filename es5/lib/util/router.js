"use strict";
Object.defineProperties(exports, {
  routerHandleable: {get: function() {
      return routerHandleable;
    }},
  __esModule: {value: true}
});
var $__quiver_45_error__,
    $__url__,
    $__quiver_45_promise__;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var parseUrl = ($__url__ = require("url"), $__url__ && $__url__.__esModule && $__url__ || {default: $__url__}).parse;
var reject = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).reject;
var getHandlerFromPath = (function(routeIndex, path, args) {
  var staticHandler = routeIndex.staticRoutes[path];
  if (staticHandler)
    return staticHandler;
  var dynamicRoutes = routeIndex.dynamicRoutes;
  for (var $__3 = dynamicRoutes[Symbol.iterator](),
      $__4; !($__4 = $__3.next()).done; ) {
    var route = $__4.value;
    {
      var matched = route.matcher(path, args);
      if (matched)
        return route.handler;
    }
  }
  if (routeIndex.defaultRoute)
    return routeIndex.defaultRoute;
  return null;
});
var httpRouterHandler = (function(routeIndex) {
  return (function(requestHead, requestStreamable) {
    var $__5 = requestHead,
        args = $__5.args,
        path = $__5.path;
    var handler = getHandlerFromPath(routeIndex, path, args);
    if (!handler)
      return reject(error(404, 'not found'));
    return handler(requestHead, requestStreamable);
  });
});
var streamRouterHandler = (function(routeIndex) {
  return (function(args, streamable) {
    var $__6;
    var $__5 = args,
        path = ($__6 = $__5.path) === void 0 ? '/' : $__6;
    var handler = getHandlerFromPath(routeIndex, path, args);
    if (!handler)
      return reject(error(404, 'not found'));
    return handler(args, streamable);
  });
});
var routerHandleable = (function(indexes) {
  var streamHandler = streamRouterHandler(indexes.stream.routeIndex);
  var httpHandler = httpRouterHandler(indexes.http.routeIndex);
  return {
    get streamHandler() {
      return streamHandler;
    },
    get httpHandler() {
      return httpHandler;
    }
  };
});
