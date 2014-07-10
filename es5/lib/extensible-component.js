"use strict";
Object.defineProperties(exports, {
  ExtensibleHandler: {get: function() {
      return ExtensibleHandler;
    }},
  ExtensibleMiddleware: {get: function() {
      return ExtensibleMiddleware;
    }},
  __esModule: {value: true}
});
var $__1 = $traceurRuntime.assertObject(require('./component.js')),
    HandlerComponent = $__1.HandlerComponent,
    MiddlewareComponent = $__1.MiddlewareComponent;
var $__1 = $traceurRuntime.assertObject(require('./util/middleware.js')),
    combineMiddlewares = $__1.combineMiddlewares,
    combineBuilderWithMiddleware = $__1.combineBuilderWithMiddleware;
var mixinMiddlewareExtensible = $traceurRuntime.assertObject(require('./mixin-middleware.js')).mixinMiddlewareExtensible;
var ExtensibleHandler = function ExtensibleHandler(options) {
  this.initMiddlewareExtension(options);
  $traceurRuntime.superCall(this, $ExtensibleHandler.prototype, "constructor", [options]);
};
var $ExtensibleHandler = ExtensibleHandler;
($traceurRuntime.createClass)(ExtensibleHandler, {
  get handleableBuilder() {
    var mainBuilder = this.mainHandleableBuilder;
    var extendMiddleware = this.extendMiddleware;
    return combineBuilderWithMiddleware(mainBuilder, extendMiddleware);
  },
  get mainHandleableBuilder() {
    throw new Error('unimplemented');
  },
  privatize: function(privateCopy, bundle) {
    this.privatizeMiddlewares(privateCopy, bundle);
    $traceurRuntime.superCall(this, $ExtensibleHandler.prototype, "privatize", [privateCopy, bundle]);
  },
  toJson: function() {
    var json = $traceurRuntime.superCall(this, $ExtensibleHandler.prototype, "toJson", []);
    json.middlewares = this.middlewareJson();
    return json;
  }
}, {}, HandlerComponent);
mixinMiddlewareExtensible(ExtensibleHandler.prototype);
var ExtensibleMiddleware = function ExtensibleMiddleware(options) {
  this.initMiddlewareExtension(options);
  $traceurRuntime.superCall(this, $ExtensibleMiddleware.prototype, "constructor", [options]);
};
var $ExtensibleMiddleware = ExtensibleMiddleware;
($traceurRuntime.createClass)(ExtensibleMiddleware, {
  get handleableMiddleware() {
    var mainMiddleware = this.mainHandleableMiddleware;
    var extendMiddleware = this.extendMiddleware;
    return combineMiddlewares([mainMiddleware, extendMiddleware]);
  },
  privatize: function(privateCopy, bundle) {
    this.privatizeMiddlewares(privateCopy, bundle);
    $traceurRuntime.superCall(this, $ExtensibleMiddleware.prototype, "privatize", [privateCopy, bundle]);
  },
  toJson: function() {
    var json = $traceurRuntime.superCall(this, $ExtensibleMiddleware.prototype, "toJson", []);
    json.middlewares = this.middlewareJson();
    return json;
  }
}, {}, MiddlewareComponent);
mixinMiddlewareExtensible(ExtensibleMiddleware.prototype);
