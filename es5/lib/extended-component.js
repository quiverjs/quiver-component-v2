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
var loadHandleable = $traceurRuntime.assertObject(require('./util/loader.js')).loadHandleable;
var $__1 = $traceurRuntime.assertObject(require('./extensible-component.js')),
    ExtensibleHandler = $__1.ExtensibleHandler,
    ExtensibleMiddleware = $__1.ExtensibleMiddleware;
var $__1 = $traceurRuntime.assertObject(require('./util/middleware.js')),
    combineBuilderWithMiddleware = $__1.combineBuilderWithMiddleware,
    combineMiddlewares = $__1.combineMiddlewares;
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
