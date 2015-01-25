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
var $__config__;
var getInitTable = ($__config__ = require("./config"), $__config__ && $__config__.__esModule && $__config__ || {default: $__config__}).getInitTable;
let noopMiddleware = (function(config, builder) {
  return builder(config);
});
let combineBuilderWithMiddleware = (function(builder, middleware) {
  return (function(config) {
    return middleware(config, builder);
  });
});
let combineBuilderWithMiddlewares = (function(builder, middlewares) {
  return middlewares.reduce(combineBuilderWithMiddleware, builder);
});
let combineTwoMiddlewares = (function(middleware1, middleware2) {
  return (function(config, builder) {
    return middleware2(config, combineBuilderWithMiddleware(builder, middleware1));
  });
});
let combineMiddlewares = (function(middlewares) {
  let count = middlewares.length;
  if (count == 0)
    return noopMiddleware;
  if (count == 1)
    return middlewares[0];
  return middlewares.slice(1).reduce(combineTwoMiddlewares, middlewares[0]);
});
let combineMiddlewareComponents = (function(components) {
  return combineMiddlewares(components.map((function(component) {
    return component.toHandleableMiddleware();
  })));
});
let repeatOnceMiddleware = (function(id, middleware) {
  return (function(config, builder) {
    let initTable = getInitTable(config);
    if (initTable[id])
      return builder(config);
    return middleware(config, builder);
  });
});
