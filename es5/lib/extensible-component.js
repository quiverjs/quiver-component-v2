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
var $__quiver_45_object__,
    $__component_46_js__,
    $__util_47_middleware_46_js__,
    $__mixin_45_middleware_46_js__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var $__1 = ($__component_46_js__ = require("./component.js"), $__component_46_js__ && $__component_46_js__.__esModule && $__component_46_js__ || {default: $__component_46_js__}),
    HandlerComponent = $__1.HandlerComponent,
    MiddlewareComponent = $__1.MiddlewareComponent;
var $__2 = ($__util_47_middleware_46_js__ = require("./util/middleware.js"), $__util_47_middleware_46_js__ && $__util_47_middleware_46_js__.__esModule && $__util_47_middleware_46_js__ || {default: $__util_47_middleware_46_js__}),
    combineMiddlewares = $__2.combineMiddlewares,
    combineBuilderWithMiddleware = $__2.combineBuilderWithMiddleware;
var mixinMiddlewareExtensible = ($__mixin_45_middleware_46_js__ = require("./mixin-middleware.js"), $__mixin_45_middleware_46_js__ && $__mixin_45_middleware_46_js__.__esModule && $__mixin_45_middleware_46_js__ || {default: $__mixin_45_middleware_46_js__}).mixinMiddlewareExtensible;
var copyConfigBuilder = (function(builder) {
  return (function(config) {
    return builder(copy(config));
  });
});
var ExtensibleHandler = function ExtensibleHandler(options) {
  var $__6;
  var $__5 = options,
      copyConfig = ($__6 = $__5.copyConfig) === void 0 ? true : $__6;
  this._copyConfig = copyConfig;
  this.initMiddlewareExtension(options);
  $traceurRuntime.superCall(this, $ExtensibleHandler.prototype, "constructor", [options]);
};
var $ExtensibleHandler = ExtensibleHandler;
($traceurRuntime.createClass)(ExtensibleHandler, {
  get handleableBuilder() {
    var copyConfig = this._copyConfig;
    var mainBuilder = this.mainHandleableBuilder;
    var extendMiddleware = this.extendMiddleware;
    var builder = combineBuilderWithMiddleware(mainBuilder, extendMiddleware);
    if (copyConfig)
      builder = copyConfigBuilder(builder);
    return builder;
  },
  get mainHandleableBuilder() {
    throw new Error('unimplemented');
  },
  privatize: function(privateInstance, privateTable) {
    this.privatizeMiddlewares(privateInstance, privateTable);
    $traceurRuntime.superCall(this, $ExtensibleHandler.prototype, "privatize", [privateInstance, privateTable]);
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
  get mainHandleableMiddleware() {
    throw new Error('unimplemented');
  },
  privatize: function(privateInstance, privateTable) {
    this.privatizeMiddlewares(privateInstance, privateTable);
    $traceurRuntime.superCall(this, $ExtensibleMiddleware.prototype, "privatize", [privateInstance, privateTable]);
  },
  toJson: function() {
    var json = $traceurRuntime.superCall(this, $ExtensibleMiddleware.prototype, "toJson", []);
    json.middlewares = this.middlewareJson();
    return json;
  }
}, {}, MiddlewareComponent);
mixinMiddlewareExtensible(ExtensibleMiddleware.prototype);
