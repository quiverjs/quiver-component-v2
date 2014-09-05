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
    $__util_47_loader_46_js__,
    $__component_46_js__,
    $__extensible_45_component_46_js__,
    $__util_47_middleware_46_js__;
var assertInstanceOf = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).assertInstanceOf;
var loadHandleable = ($__util_47_loader_46_js__ = require("./util/loader.js"), $__util_47_loader_46_js__ && $__util_47_loader_46_js__.__esModule && $__util_47_loader_46_js__ || {default: $__util_47_loader_46_js__}).loadHandleable;
var HandlerComponent = ($__component_46_js__ = require("./component.js"), $__component_46_js__ && $__component_46_js__.__esModule && $__component_46_js__ || {default: $__component_46_js__}).HandlerComponent;
var $__3 = ($__extensible_45_component_46_js__ = require("./extensible-component.js"), $__extensible_45_component_46_js__ && $__extensible_45_component_46_js__.__esModule && $__extensible_45_component_46_js__ || {default: $__extensible_45_component_46_js__}),
    ExtensibleHandler = $__3.ExtensibleHandler,
    ExtensibleMiddleware = $__3.ExtensibleMiddleware;
var $__4 = ($__util_47_middleware_46_js__ = require("./util/middleware.js"), $__util_47_middleware_46_js__ && $__util_47_middleware_46_js__.__esModule && $__util_47_middleware_46_js__ || {default: $__util_47_middleware_46_js__}),
    combineBuilderWithMiddleware = $__4.combineBuilderWithMiddleware,
    combineMiddlewares = $__4.combineMiddlewares;
var ExtendedHandler = function ExtendedHandler(handlerComponent) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  assertInstanceOf(handlerComponent, HandlerComponent, 'must extend from another handler component');
  this._parentHandler = handlerComponent;
  $traceurRuntime.superCall(this, $ExtendedHandler.prototype, "constructor", [options]);
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
    var json = $traceurRuntime.superCall(this, $ExtendedHandler.prototype, "toJson", []);
    json.parentHandler = this.parentHandler.toJson();
    return json;
  }
}, {}, ExtensibleHandler);
var ExtendedMiddleware = function ExtendedMiddleware(middlewareComponent) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  assertInstanceOf(middlewareComponent, MiddlewareComponent, 'must extend from another middleware component');
  this._parentMiddleware = middlewareComponent;
  $traceurRuntime.superCall(this, $ExtendedMiddleware.prototype, "constructor", [options]);
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
    var json = $traceurRuntime.superCall(this, $ExtendedMiddleware.prototype, "toJson", []);
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
