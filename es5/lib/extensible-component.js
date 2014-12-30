"use strict";
Object.defineProperties(exports, {
  ExtensibleComponent: {get: function() {
      return ExtensibleComponent;
    }},
  ExtensibleHandler: {get: function() {
      return ExtensibleHandler;
    }},
  ExtensibleMiddleware: {get: function() {
      return ExtensibleMiddleware;
    }},
  __esModule: {value: true}
});
var $__quiver_45_object__,
    $__component__,
    $__util_47_middleware__,
    $__util_47_loader__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var Component = ($__component__ = require("./component"), $__component__ && $__component__.__esModule && $__component__ || {default: $__component__}).Component;
var $__2 = ($__util_47_middleware__ = require("./util/middleware"), $__util_47_middleware__ && $__util_47_middleware__.__esModule && $__util_47_middleware__ || {default: $__util_47_middleware__}),
    combineMiddlewares = $__2.combineMiddlewares,
    combineMiddlewareComponents = $__2.combineMiddlewareComponents,
    combineBuilderWithMiddleware = $__2.combineBuilderWithMiddleware;
var loadHandleable = ($__util_47_loader__ = require("./util/loader"), $__util_47_loader__ && $__util_47_loader__.__esModule && $__util_47_loader__ || {default: $__util_47_loader__}).loadHandleable;
var copyConfigBuilder = (function(builder) {
  return (function(config) {
    return builder(copy(config));
  });
});
var ExtensibleComponent = function ExtensibleComponent() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  this._middlewareComponents = [];
  $traceurRuntime.superConstructor($ExtensibleComponent).call(this, options);
};
var $ExtensibleComponent = ExtensibleComponent;
($traceurRuntime.createClass)(ExtensibleComponent, {
  addMiddleware: function(middleware) {
    if (!middleware.isMiddlewareComponent)
      throw new TypeError('middleware must be ' + 'of type MiddlewareComponent');
    this._middlewareComponents.push(middleware);
    return this;
  },
  middleware: function(middleware) {
    return this.addMiddleware(middleware);
  },
  each: function(iteratee) {
    this._middlewareComponents.forEach(iteratee);
    $traceurRuntime.superGet(this, $ExtensibleComponent.prototype, "each").call(this, iteratee);
  },
  doMap: function(target, mapper) {
    target._middlewareComponents = this._middlewareComponents.map(mapper);
    $traceurRuntime.superGet(this, $ExtensibleComponent.prototype, "doMap").call(this, target, mapper);
  },
  toExtendMiddleware: function() {
    return combineMiddlewareComponents(this._middlewareComponents);
  },
  get middlewareComponents() {
    return this._middlewareComponents;
  }
}, {}, Component);
var ExtensibleHandler = function ExtensibleHandler(options) {
  var $__6;
  var $__5 = options,
      copyConfig = ($__6 = $__5.copyConfig) === void 0 ? true : $__6;
  this._copyConfig = copyConfig;
  $traceurRuntime.superConstructor($ExtensibleHandler).call(this, options);
};
var $ExtensibleHandler = ExtensibleHandler;
($traceurRuntime.createClass)(ExtensibleHandler, {
  toHandleableBuilder: function() {
    var copyConfig = this._copyConfig;
    var mainBuilder = this.toMainHandleableBuilder();
    var extendMiddleware = this.toExtendMiddleware();
    var builder = combineBuilderWithMiddleware(mainBuilder, extendMiddleware);
    if (copyConfig)
      builder = copyConfigBuilder(builder);
    return builder;
  },
  toMainHandleableBuilder: function() {
    throw new Error('unimplemented');
  },
  loadHandleable: function(config, options) {
    return loadHandleable(config, this.id, this.toHandleableBuilder(), options);
  },
  loadHandler: function(config, options) {
    var loader = this.handlerLoader;
    return loader(config, this.id, this.toHandleableBuilder(), options);
  },
  setLoader: function(handlerLoader) {
    this._handlerLoader = handlerLoader;
    return this;
  },
  get handlerLoader() {
    if (this._handlerLoader)
      return this._handlerLoader;
    return this.defaultLoader;
  },
  get defaultLoader() {
    return loadHandleable;
  },
  get type() {
    return 'handler';
  },
  get isHandlerComponent() {
    return true;
  }
}, {}, ExtensibleComponent);
var ExtensibleMiddleware = function ExtensibleMiddleware() {
  $traceurRuntime.superConstructor($ExtensibleMiddleware).apply(this, arguments);
};
var $ExtensibleMiddleware = ExtensibleMiddleware;
($traceurRuntime.createClass)(ExtensibleMiddleware, {
  toHandleableMiddleware: function() {
    var mainMiddleware = this.toMainHandleableMiddleware();
    var extendMiddleware = this.toExtendMiddleware();
    return combineMiddlewares([mainMiddleware, extendMiddleware]);
  },
  toMainHandleableMiddleware: function() {
    throw new Error('unimplemented');
  },
  get isMiddlewareComponent() {
    return true;
  }
}, {}, ExtensibleComponent);
