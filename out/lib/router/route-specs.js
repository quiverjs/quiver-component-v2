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
let getHandlerFromPath = (function(routeIndex, path, args) {
  let staticHandler = routeIndex.staticRoutes[path];
  if (staticHandler)
    return staticHandler;
  let dynamicRoutes = routeIndex.dynamicRoutes;
  for (var $__4 = dynamicRoutes[$traceurRuntime.toProperty(Symbol.iterator)](),
      $__5; !($__5 = $__4.next()).done; ) {
    let route = $__5.value;
    {
      let matched = route.matcher(path, args);
      if (matched)
        return route.handler;
    }
  }
  if (routeIndex.defaultRoute)
    return routeIndex.defaultRoute;
  return null;
});
let httpRouterHandler = (function(routeIndex) {
  return (function(requestHead, requestStreamable) {
    let $__6 = requestHead,
        args = $__6.args,
        path = $__6.path;
    let handler = getHandlerFromPath(routeIndex, path, args);
    if (!handler)
      return reject(error(404, 'not found'));
    return handler(requestHead, requestStreamable);
  });
});
let streamRouterHandler = (function(routeIndex) {
  return (function(args, streamable) {
    var $__7;
    let $__6 = args,
        path = ($__7 = $__6.path) === void 0 ? '/' : $__7;
    let handler = getHandlerFromPath(routeIndex, path, args);
    if (!handler)
      return reject(error(404, 'not found'));
    return handler(args, streamable);
  });
});
let handleableToStreamHandler = (function(handleable) {
  return handleable.streamHandler;
});
let handleableToHttpHandler = (function(handleable) {
  if (handleable.httpHandler)
    return handleable.httpHandler;
  if (handleable.streamHandler)
    return streamToHttpHandler(handleable.streamHandler);
  return null;
});
let routeSpecsToRouteIndex = (function(routeSpecs, getHandler) {
  let staticRoutes = {};
  let dynamicRoutes = [];
  let defaultRoute = null;
  routeSpecs.forEach((function(routeSpec) {
    let $__6 = routeSpec,
        routeType = $__6.routeType,
        handleable = $__6.handleable;
    let handler = getHandler(handleable);
    if (!handler)
      return ;
    if (routeType == 'static') {
      let path = routeSpec.path;
      staticRoutes[path] = handler;
    } else if (routeType == 'dynamic') {
      let matcher = routeSpec.matcher;
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
let routeSpecsToRouterHandleable = (function(routeSpecs) {
  let streamIndex = routeSpecsToRouteIndex(routeSpecs, handleableToStreamHandler);
  let httpIndex = routeSpecsToRouteIndex(routeSpecs, handleableToHttpHandler);
  let streamHandler = streamRouterHandler(streamIndex);
  let httpHandler = httpRouterHandler(httpIndex);
  return {
    streamHandler: streamHandler,
    httpHandler: httpHandler
  };
});
let routeBuildSpecsToRouteSpecs = async(function*(config, routeBuildSpecs) {
  let routeSpecs = [];
  for (let i = 0; i < routeBuildSpecs.length; i++) {
    let routeBuildSpec = routeBuildSpecs[i];
    let builder = routeBuildSpec.builder;
    let routeSpec = copy(routeBuildSpec);
    routeSpec.handleable = yield builder(config);
    routeSpecs.push(routeSpec);
  }
  return routeSpecs;
});
let routeBuildSpecsToRouterBuilder = (function(routeBuildSpecs) {
  return async(function*(config) {
    let routeSpecs = yield routeBuildSpecsToRouteSpecs(config, routeBuildSpecs);
    return routeSpecsToRouterHandleable(routeSpecs);
  });
});
