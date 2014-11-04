"use strict";
Object.defineProperties(exports, {
  routeSpecsToRouterHandleable: {get: function() {
      return routeSpecsToRouterHandleable;
    }},
  routeBuildSpecsToRouterBuilder: {get: function() {
      return routeBuildSpecsToRouterBuilder;
    }},
  __esModule: {value: true}
});
var $__quiver_45_object__,
    $__quiver_45_error__,
    $__quiver_45_promise__,
    $__quiver_45_http__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var $__2 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    async = $__2.async,
    reject = $__2.reject;
var streamToHttpHandler = ($__quiver_45_http__ = require("quiver-http"), $__quiver_45_http__ && $__quiver_45_http__.__esModule && $__quiver_45_http__ || {default: $__quiver_45_http__}).streamToHttpHandler;
var getHandlerFromPath = (function(routeIndex, path, args) {
  var staticHandler = routeIndex.staticRoutes[path];
  if (staticHandler)
    return staticHandler;
  var dynamicRoutes = routeIndex.dynamicRoutes;
  for (var $__4 = dynamicRoutes[Symbol.iterator](),
      $__5; !($__5 = $__4.next()).done; ) {
    var route = $__5.value;
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
    var $__6 = requestHead,
        args = $__6.args,
        path = $__6.path;
    var handler = getHandlerFromPath(routeIndex, path, args);
    if (!handler)
      return reject(error(404, 'not found'));
    return handler(requestHead, requestStreamable);
  });
});
var streamRouterHandler = (function(routeIndex) {
  return (function(args, streamable) {
    var $__7;
    var $__6 = args,
        path = ($__7 = $__6.path) === void 0 ? '/' : $__7;
    var handler = getHandlerFromPath(routeIndex, path, args);
    if (!handler)
      return reject(error(404, 'not found'));
    return handler(args, streamable);
  });
});
var handleableToStreamHandler = (function(handleable) {
  return handleable.streamHandler;
});
var handleableToHttpHandler = (function(handleable) {
  if (handleable.httpHandler)
    return handleable.httpHandler;
  if (handleable.streamHandler)
    return streamToHttpHandler(handleable.streamHandler);
  return null;
});
var routeSpecsToRouteIndex = (function(routeSpecs, getHandler) {
  var staticRoutes = {};
  var dynamicRoutes = [];
  var defaultRoute = null;
  routeSpecs.forEach((function(routeSpec) {
    var $__6 = routeSpec,
        routeType = $__6.routeType,
        handleable = $__6.handleable;
    var handler = getHandler(handleable);
    if (!handler)
      return;
    if (routeType == 'static') {
      var path = routeSpec.path;
      staticRoutes[path] = handler;
    } else if (routeType == 'dynamic') {
      var matcher = routeSpec.matcher;
      dynamicRoutes.push({
        matcher: matcher,
        handler: handler
      });
    } else if (routeType == 'default') {
      defaultRoute = handler;
    }
  }));
  return {
    staticRoutes: staticRoutes,
    dynamicRoutes: dynamicRoutes,
    defaultRoute: defaultRoute
  };
});
var routeSpecsToRouterHandleable = (function(routeSpecs) {
  var streamIndex = routeSpecsToRouteIndex(routeSpecs, handleableToStreamHandler);
  var httpIndex = routeSpecsToRouteIndex(routeSpecs, handleableToHttpHandler);
  var streamHandler = streamRouterHandler(streamIndex);
  var httpHandler = httpRouterHandler(httpIndex);
  return {
    streamHandler: streamHandler,
    httpHandler: httpHandler
  };
});
var routeBuildSpecsToRouteSpecs = async($traceurRuntime.initGeneratorFunction(function $__9(config, routeBuildSpecs) {
  var routeSpecs,
      i,
      routeBuildSpec,
      builder,
      routeSpec;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          routeSpecs = [];
          $ctx.state = 15;
          break;
        case 15:
          i = 0;
          $ctx.state = 11;
          break;
        case 11:
          $ctx.state = (i < routeBuildSpecs.length) ? 5 : 9;
          break;
        case 8:
          i++;
          $ctx.state = 11;
          break;
        case 5:
          routeBuildSpec = routeBuildSpecs[i];
          builder = routeBuildSpec.builder;
          routeSpec = copy(routeBuildSpec);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return builder(config);
        case 2:
          routeSpec.handleable = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          routeSpecs.push(routeSpec);
          $ctx.state = 8;
          break;
        case 9:
          $ctx.returnValue = routeSpecs;
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__9, this);
}));
var routeBuildSpecsToRouterBuilder = (function(routeBuildSpecs) {
  return async($traceurRuntime.initGeneratorFunction(function $__10(config) {
    var routeSpecs;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.state = 2;
            return routeBuildSpecsToRouteSpecs(config, routeBuildSpecs);
          case 2:
            routeSpecs = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.returnValue = routeSpecsToRouterHandleable(routeSpecs);
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__10, this);
  }));
});
