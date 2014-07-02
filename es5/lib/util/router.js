"use strict";
Object.defineProperties(exports, {
  routerHandleable: {get: function() {
      return routerHandleable;
    }},
  __esModule: {value: true}
});
var error = $traceurRuntime.assertObject(require('quiver-error')).error;
var parseUrl = $traceurRuntime.assertObject(require('url')).parse;
var reject = $traceurRuntime.assertObject(require('quiver-promise')).reject;
var getPathFromRequestHead = function(requestHead) {
  if (!requestHead.args)
    requestHead.args = {};
  if (requestHead.args.path)
    return requestHead.args.path;
  var path = parseUrl(requestHead.url, true).pathname;
  requestHead.args.path = path;
};
var getHandlerFromPath = (function(routeIndex, path, args) {
  var staticHandler = routeIndex.staticRoutes[path];
  if (staticHandler)
    return staticHandler;
  var dynamicRoutes = routeIndex.dynamicRoutes;
  for (var $__0 = dynamicRoutes[Symbol.iterator](),
      $__1; !($__1 = $__0.next()).done; ) {
    var route = $__1.value;
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
    var path = getPathFromRequestHead(requestHead);
    var args = $traceurRuntime.assertObject(requestHead).args;
    var handler = getHandlerFromPath(routeIndex, path, args);
    if (!handler)
      return reject(error(404, 'not found'));
    return handler(requestHead, requestStreamable);
  });
});
var streamRouterHandler = (function(routeIndex) {
  return (function(args, streamable) {
    var $__3;
    var $__2 = $traceurRuntime.assertObject(args),
        path = ($__3 = $__2.path) === void 0 ? '/' : $__3;
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
