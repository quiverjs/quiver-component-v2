"use strict";
Object.defineProperties(exports, {
  ExtendedHandler: {get: function() {
      return ExtendedHandler;
    }},
  ExtendedMiddleware: {get: function() {
      return ExtendedMiddleware;
    }},
  extendHandler: {get: function() {
      return extendHandler;
    }},
  extendMiddleware: {get: function() {
      return extendMiddleware;
    }},
  __esModule: {value: true}
});
var $__quiver_45_object__,
    $__util_47_loader__,
    $__component__,
    $__extensible_45_component__,
    $__util_47_middleware__;
var assertInstanceOf = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).assertInstanceOf;
var loadHandleable = ($__util_47_loader__ = require("./util/loader"), $__util_47_loader__ && $__util_47_loader__.__esModule && $__util_47_loader__ || {default: $__util_47_loader__}).loadHandleable;
var HandlerComponent = ($__component__ = require("./component"), $__component__ && $__component__.__esModule && $__component__ || {default: $__component__}).HandlerComponent;
var $__3 = ($__extensible_45_component__ = require("./extensible-component"), $__extensible_45_component__ && $__extensible_45_component__.__esModule && $__extensible_45_component__ || {default: $__extensible_45_component__}),
    ExtensibleHandler = $__3.ExtensibleHandler,
    ExtensibleMiddleware = $__3.ExtensibleMiddleware;
var $__4 = ($__util_47_middleware__ = require("./util/middleware"), $__util_47_middleware__ && $__util_47_middleware__.__esModule && $__util_47_middleware__ || {default: $__util_47_middleware__}),
    combineBuilderWithMiddleware = $__4.combineBuilderWithMiddleware,
    combineMiddlewares = $__4.combineMiddlewares;
var ExtendedHandler = function ExtendedHandler(handlerComponent) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  assertInstanceOf(handlerComponent, HandlerComponent, 'must extend from another handler component');
  this._parentHandler = handlerComponent;
  $traceurRuntime.superConstructor($ExtendedHandler).call(this, options);
};
var $ExtendedHandler = ExtendedHandler;
($traceurRuntime.createClass)(ExtendedHandler, {
  get mainHandleableBuilder() {
    return this._parentHandler.handleableBuilder;
  },
  get parentHandler() {
    return this._parentHandler;
  },
  get handlerLoader() {
    return this.parentHandler.handlerLoader;
  },
  get type() {
    return 'extend handler';
  },
  toJson: function() {
    var json = $traceurRuntime.superGet(this, $ExtendedHandler.prototype, "toJson").call(this);
    json.parentHandler = this.parentHandler.toJson();
    return json;
  }
}, {}, ExtensibleHandler);
var ExtendedMiddleware = function ExtendedMiddleware(middlewareComponent) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  assertInstanceOf(middlewareComponent, MiddlewareComponent, 'must extend from another middleware component');
  this._parentMiddleware = middlewareComponent;
  $traceurRuntime.superConstructor($ExtendedMiddleware).call(this, options);
};
var $ExtendedMiddleware = ExtendedMiddleware;
($traceurRuntime.createClass)(ExtendedMiddleware, {
  get mainHandleableMiddleware() {
    return this.parentMiddleware.handleableMiddleware;
  },
  get parentMiddleware() {
    return this._parentMiddleware;
  },
  get type() {
    return 'extend middleware';
  },
  toJson: function() {
    var json = $traceurRuntime.superGet(this, $ExtendedMiddleware.prototype, "toJson").call(this);
    json.parentMiddleware = this.parentMiddleware.toJson();
    return json;
  }
}, {}, ExtensibleMiddleware);
var extendHandler = (function(handler, options) {
  return new ExtendedHandler(handler, options);
});
var extendMiddleware = (function(middleware, options) {
  return new ExtendedMiddleware(middleware, options);
});
