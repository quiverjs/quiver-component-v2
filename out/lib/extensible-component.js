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
    $__list__,
    $__util_47_middleware__,
    $__util_47_loader__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var Component = ($__component__ = require("./component"), $__component__ && $__component__.__esModule && $__component__ || {default: $__component__}).Component;
var componentList = ($__list__ = require("./list"), $__list__ && $__list__.__esModule && $__list__ || {default: $__list__}).componentList;
var $__3 = ($__util_47_middleware__ = require("./util/middleware"), $__util_47_middleware__ && $__util_47_middleware__.__esModule && $__util_47_middleware__ || {default: $__util_47_middleware__}),
    combineMiddlewares = $__3.combineMiddlewares,
    combineMiddlewareComponents = $__3.combineMiddlewareComponents,
    combineBuilderWithMiddleware = $__3.combineBuilderWithMiddleware;
var loadHandleable = ($__util_47_loader__ = require("./util/loader"), $__util_47_loader__ && $__util_47_loader__.__esModule && $__util_47_loader__ || {default: $__util_47_loader__}).loadHandleable;
let copyConfigBuilder = (function(builder) {
  return (function(config) {
    return builder(copy(config));
  });
});
var ExtensibleComponent = function ExtensibleComponent() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  this._middlewareComponents = [];
  $traceurRuntime.superConstructor($ExtensibleComponent).call(this, options);
  this.subComponents.middlewareList = componentList();
};
var $ExtensibleComponent = ExtensibleComponent;
($traceurRuntime.createClass)(ExtensibleComponent, {
  addMiddleware: function(middleware) {
    if (!middleware.isMiddlewareComponent)
      throw new TypeError('middleware must be ' + 'of type MiddlewareComponent');
    this.middlewareList.push(middleware);
    return this;
  },
  middleware: function(middleware) {
    return this.addMiddleware(middleware);
  },
  toExtendMiddleware: function() {
    return combineMiddlewareComponents(this.middlewareComponents);
  },
  get middlewareList() {
    return this.subComponents.middlewareList;
  },
  get middlewareComponents() {
    return this.middlewareList.array;
  }
}, {}, Component);
var ExtensibleHandler = function ExtensibleHandler(options) {
  var $__7;
  let $__6 = options,
      copyConfig = ($__7 = $__6.copyConfig) === void 0 ? true : $__7;
  this._copyConfig = copyConfig;
  $traceurRuntime.superConstructor($ExtensibleHandler).call(this, options);
};
var $ExtensibleHandler = ExtensibleHandler;
($traceurRuntime.createClass)(ExtensibleHandler, {
  toHandleableBuilder: function() {
    let copyConfig = this._copyConfig;
    let mainBuilder = this.toMainHandleableBuilder();
    let extendMiddleware = this.toExtendMiddleware();
    let builder = combineBuilderWithMiddleware(mainBuilder, extendMiddleware);
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
    let loader = this.handlerLoader;
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
    let mainMiddleware = this.toMainHandleableMiddleware();
    let extendMiddleware = this.toExtendMiddleware();
    return combineMiddlewares([mainMiddleware, extendMiddleware]);
  },
  toMainHandleableMiddleware: function() {
    throw new Error('unimplemented');
  },
  get isMiddlewareComponent() {
    return true;
  }
}, {}, ExtensibleComponent);
