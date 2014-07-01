"use strict";
Object.defineProperties(exports, {
  routerHandleable: {get: function() {
      return routerHandleable;
    }},
  __esModule: {value: true}
});
var error = $traceurRuntime.assertObject(require('quiver-error')).error;
var parseUrl = $traceurRuntime.assertObject(require('url')).parse;
var getPathFromRequestHead = function(requestHead) {
  if (!requestHead.args)
    requestHead.args = {};
  if (requestHead.args.path) {
    return requestHead.args.path;
  }
  var path = parseUrl(requestHead.url, true).pathname;
  requestHead.args.path = path;
};
var getHandlerFromPath = (function(routeIndex, path) {
  var staticHandler = routeIndex.staticRoutes[path];
  if (staticHandler) {
    return {
      matchedArgs: {},
      handler: staticHandler
    };
  }
  var dynamicRoutes = routeIndex.dynamicRoutes;
  for (var $__0 = dynamicRoutes[Symbol.iterator](),
      $__1; !($__1 = $__0.next()).done; ) {
    var route = $__1.value;
    {
      var matchedArgs = route.matcher(path);
      if (matchedArgs) {
        return {
          matchedArgs: matchedArgs,
          handler: dynamicRoutes[i].handler
        };
      }
    }
  }
  if (routeIndex.defaultRoute) {
    return {
      matchedArgs: {},
      handler: routeIndex.defaultRoute
    };
  }
  return null;
});
var httpRouterHandler = (function(routeIndex) {
  return (function(requestHead, requestStreamable) {
    var path = getPathFromRequestHead(requestHead);
    var result = getHandlerFromPath(path, routeIndex);
    if (!result)
      return reject(error(404, 'not found'));
    var $__2 = $traceurRuntime.assertObject(result),
        handler = $__2.handler,
        matchedArgs = $__2.matchedArgs;
    var args = requestHead.args;
    for (var key in matchedArgs) {
      args[key] = matchedArgs[key];
    }
    return handler(requestHead, requestStreamable);
  });
});
var streamRouterHandler = (function(routeIndex) {
  return (function(args, inputStreamable) {
    var path = args.path || '/';
    var result = getHandlerFromPath(path, routeIndex);
    if (!result)
      return reject(error(404, 'not found'));
    var $__2 = $traceurRuntime.assertObject(result),
        handler = $__2.handler,
        matchedArgs = $__2.matchedArgs;
    for (var key in matchedArgs) {
      args[key] = matchedArgs[key];
    }
    return handler(args, inputStreamable);
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
