"use strict";
Object.defineProperties(exports, {
  ExtendedHandler: {get: function() {
      return ExtendedHandler;
    }},
  ExtendedMiddleware: {get: function() {
      return ExtendedMiddleware;
    }},
  __esModule: {value: true}
});
var assertInstanceOf = $traceurRuntime.assertObject(require('quiver-object')).assertInstanceOf;
var mixinMiddlewareExtensible = $traceurRuntime.assertObject(require('./extend-middleware.js')).mixinMiddlewareExtensible;
var loadHandleable = $traceurRuntime.assertObject(require('./util/loader.js')).loadHandleable;
var $__1 = $traceurRuntime.assertObject(require('./component.js')),
    HandlerComponent = $__1.HandlerComponent,
    MiddlewareComponent = $__1.MiddlewareComponent;
var $__1 = $traceurRuntime.assertObject(require('./util/middleware.js')),
    combineBuilderWithMiddleware = $__1.combineBuilderWithMiddleware,
    combineMiddlewares = $__1.combineMiddlewares;
var ExtendedHandler = function ExtendedHandler(handlerComponent) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  assertInstanceOf(handlerComponent, HandlerComponent, 'must extend from another handler component');
  this._initMiddlewareExtension(options);
  this._parentHandler = handlerComponent;
  $traceurRuntime.superCall(this, $ExtendedHandler.prototype, "constructor", [options]);
};
var $ExtendedHandler = ExtendedHandler;
($traceurRuntime.createClass)(ExtendedHandler, {
  get handleableBuilder() {
    var builder = this._parentHandler.handleableBuilder;
    var middleware = this.extendMiddleware;
    return combineBuilderWithMiddleware(builder, middleware);
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
}, {}, HandlerComponent);
mixinMiddlewareExtensible(ExtendedHandler);
var ExtendedMiddleware = function ExtendedMiddleware(middlewareComponent) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  assertInstanceOf(middlewareComponent, MiddlewareComponent, 'must extend from another middleware component');
  this._initMiddlewareExtension(options);
  this._parentMiddleware = middlewareComponent;
  $traceurRuntime.superCall(this, $ExtendedMiddleware.prototype, "constructor", [options]);
};
var $ExtendedMiddleware = ExtendedMiddleware;
($traceurRuntime.createClass)(ExtendedMiddleware, {
  get handleableMiddleware() {
    var mainMiddleware = this.parentMiddleware.handleableMiddleware;
    var extendMiddleware = this.extendMiddleware;
    return combineMiddlewares([mainMiddleware, extendMiddleware]);
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
}, {}, MiddlewareComponent);
mixinMiddlewareExtensible(ExtendedMiddleware);
