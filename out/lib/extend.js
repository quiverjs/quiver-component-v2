"use strict";
Object.defineProperties(module.exports, {
  ExtendHandler: {get: function() {
      return ExtendHandler;
    }},
  ExtendMiddleware: {get: function() {
      return ExtendMiddleware;
    }},
  extendHandler: {get: function() {
      return extendHandler;
    }},
  extendMiddleware: {get: function() {
      return extendMiddleware;
    }},
  __esModule: {value: true}
});
var $__util_47_loader__,
    $__handleable_45_builder__,
    $__handleable_45_middleware__;
var loadHandleable = ($__util_47_loader__ = require("./util/loader"), $__util_47_loader__ && $__util_47_loader__.__esModule && $__util_47_loader__ || {default: $__util_47_loader__}).loadHandleable;
var HandleableBuilder = ($__handleable_45_builder__ = require("./handleable-builder"), $__handleable_45_builder__ && $__handleable_45_builder__.__esModule && $__handleable_45_builder__ || {default: $__handleable_45_builder__}).HandleableBuilder;
var HandleableMiddleware = ($__handleable_45_middleware__ = require("./handleable-middleware"), $__handleable_45_middleware__ && $__handleable_45_middleware__.__esModule && $__handleable_45_middleware__ || {default: $__handleable_45_middleware__}).HandleableMiddleware;
var ExtendHandler = function ExtendHandler(handlerComponent) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  if (!handlerComponent.isHandlerComponent) {
    throw new Error('Extended component must be handler component');
  }
  options.safeWrapped = true;
  $traceurRuntime.superConstructor($ExtendHandler).call(this, null, options);
  this.addSubComponent('extendHandler', handlerComponent);
};
var $ExtendHandler = ExtendHandler;
($traceurRuntime.createClass)(ExtendHandler, {toMainHandleableBuilder: function() {
    let extendHandler = this.getSubComponent('extendHandler');
    let id = extendHandler.id;
    let builder = extendHandler.toHandleableBuilder();
    return (function(config) {
      return loadHandleable(config, id, builder);
    });
  }}, {}, HandleableBuilder);
var ExtendMiddleware = function ExtendMiddleware(middlewareComponent) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  if (!middlewareComponent.isMiddlewareComponent) {
    throw new Error('Extended component must be middleware component');
  }
  options.safeWrapped = true;
  $traceurRuntime.superConstructor($ExtendMiddleware).call(this, null, options);
  this.addSubComponent('extendMiddleware', middlewareComponent);
};
var $ExtendMiddleware = ExtendMiddleware;
($traceurRuntime.createClass)(ExtendMiddleware, {toMainHandleableBuilder: function() {
    return this.getSubComponent('extendMiddleware').toHandleableMiddleware();
  }}, {}, HandleableMiddleware);
let extendHandler = (function(handlerComponent) {
  return new ExtendHandler(handlerComponent);
});
let extendMiddleware = (function(middlewareComponent) {
  return new ExtendMiddleware(middlewareComponent);
});
