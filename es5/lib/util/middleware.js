"use strict";
Object.defineProperties(exports, {
  combineBuilderWithMiddleware: {get: function() {
      return combineBuilderWithMiddleware;
    }},
  combineBuilderWithMiddlewares: {get: function() {
      return combineBuilderWithMiddlewares;
    }},
  combineTwoMiddlewares: {get: function() {
      return combineTwoMiddlewares;
    }},
  combineMiddlewares: {get: function() {
      return combineMiddlewares;
    }},
  combineMiddlewareComponents: {get: function() {
      return combineMiddlewareComponents;
    }},
  repeatOnceMiddleware: {get: function() {
      return repeatOnceMiddleware;
    }},
  __esModule: {value: true}
});
var getInitTable = $traceurRuntime.assertObject(require('./config.js')).getInitTable;
var noopMiddleware = (function(config, builder) {
  return builder(config);
});
var combineBuilderWithMiddleware = (function(builder, middleware) {
  return (function(config) {
    return middleware(config, builder);
  });
});
var combineBuilderWithMiddlewares = (function(builder, middlewares) {
  return middlewares.reduce(combineBuilderWithMiddleware, builder);
});
var combineTwoMiddlewares = (function(middleware1, middleware2) {
  return (function(config, builder) {
    return middleware2(config, combineBuilderWithMiddleware(builder, middleware1));
  });
});
var combineMiddlewares = (function(middlewares) {
  var count = middlewares.length;
  if (count == 0)
    return noopMiddleware;
  if (count == 1)
    return middlewares[0];
  return middlewares.slice(1).reduce(combineTwoMiddlewares, middlewares[0]);
});
var combineMiddlewareComponents = (function(components) {
  return combineMiddlewares(components.map((function(component) {
    return component.handleableMiddleware;
  })));
});
var repeatOnceMiddleware = (function(id, middleware) {
  return (function(config, builder) {
    var initTable = getInitTable(config);
    if (initTable[id])
      return builder(config);
    return middleware(config, builder);
  });
});
