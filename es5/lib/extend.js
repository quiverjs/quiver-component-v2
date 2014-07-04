"use strict";
Object.defineProperties(exports, {
  ExtendHandler: {get: function() {
      return ExtendHandler;
    }},
  ExtendMiddleware: {get: function() {
      return ExtendMiddleware;
    }},
  __esModule: {value: true}
});
var assertInstanceOf = $traceurRuntime.assertObject(require('quiver-object')).assertInstanceOf;
var HandlerComponent = $traceurRuntime.assertObject(require('./component.js')).HandlerComponent;
var mixinMiddlewareExtensible = $traceurRuntime.assertObject(require('./extend-middleware.js')).mixinMiddlewareExtensible;
var $__1 = $traceurRuntime.assertObject(require('./util/middleware.js')),
    combineBuilderWithMiddleware = $__1.combineBuilderWithMiddleware,
    combineMiddlewares = $__1.combineMiddlewares;
var ExtendHandler = function ExtendHandler(handlerComponent) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  assertInstanceOf(handlerComponent, HandlerComponent, 'must extend from another handler component');
  this._initMiddlewareExtension(options);
  this._parentHandler = handlerComponent;
  $traceurRuntime.superCall(this, $ExtendHandler.prototype, "constructor", [options]);
};
var $ExtendHandler = ExtendHandler;
($traceurRuntime.createClass)(ExtendHandler, {
  get handleableBuilder() {
    var builder = this._parentHandler.handleableBuilder;
    var middleware = this.extendMiddleware;
    return combineBuilderWithMiddleware(builder, middleware);
  },
  get parentHandler() {
    return this._parentHandler;
  }
}, {}, HandlerComponent);
mixinMiddlewareExtensible(ExtendHandler);
var ExtendMiddleware = function ExtendMiddleware(middlewareComponent) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  assertInstanceOf(middlewareComponent, MiddlewareComponent, 'must extend from another middleware component');
  this._initMiddlewareExtension(options);
  this._parentMiddleware = middlewareComponent;
  $traceurRuntime.superCall(this, $ExtendMiddleware.prototype, "constructor", [options]);
};
var $ExtendMiddleware = ExtendMiddleware;
($traceurRuntime.createClass)(ExtendMiddleware, {
  get handleableMiddleware() {
    var mainMiddleware = this._parentMiddleware.handleableMiddleware;
    var extendMiddleware = this.extendMiddleware;
    return combineMiddlewares([mainMiddleware, extendMiddleware]);
  },
  get parentHandler() {
    return this._parentHandler;
  }
}, {}, MiddlewareComponent);
mixinMiddlewareExtensible(ExtendMiddleware);
