"use strict";
Object.defineProperties(exports, {
  InputHandlerMiddleware: {get: function() {
      return InputHandlerMiddleware;
    }},
  inputHandlerMiddleware: {get: function() {
      return inputHandlerMiddleware;
    }},
  __esModule: {value: true}
});
var $__quiver_45_object__,
    $__simple_45_middleware__,
    $__component__,
    $__extensible_45_component__;
var assertString = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).assertString;
var ConfigMiddleware = ($__simple_45_middleware__ = require("./simple-middleware"), $__simple_45_middleware__ && $__simple_45_middleware__.__esModule && $__simple_45_middleware__ || {default: $__simple_45_middleware__}).ConfigMiddleware;
var HandlerComponent = ($__component__ = require("./component"), $__component__ && $__component__.__esModule && $__component__ || {default: $__component__}).HandlerComponent;
var ExtensibleComponent = ($__extensible_45_component__ = require("./extensible-component"), $__extensible_45_component__ && $__extensible_45_component__.__esModule && $__extensible_45_component__ || {default: $__extensible_45_component__}).ExtensibleComponent;
var InputHandlerMiddleware = function InputHandlerMiddleware(handlerComponent, toConfig) {
  var $__6;
  var options = arguments[2] !== (void 0) ? arguments[2] : {};
  if (!handlerComponent.isHandlerComponent) {
    throw new TypeError('input handler must be of type HandlerComponent');
  }
  assertString(toConfig, 'toConfig required to be string');
  var $__5 = options,
      loader = ($__6 = $__5.loader) === void 0 ? handlerComponent.handlerLoader : $__6;
  this._handlerLoader = loader;
  this._toInputConfig = toConfig;
  options.safeWrapped = true;
  $traceurRuntime.superConstructor($InputHandlerMiddleware).call(this, null, options);
  this.subComponents.inputHandler = handlerComponent;
};
var $InputHandlerMiddleware = InputHandlerMiddleware;
($traceurRuntime.createClass)(InputHandlerMiddleware, {
  toConfigHandler: function() {
    var handlerComponent = this.inputHandlerComponent;
    var componentId = handlerComponent.id;
    var builder = handlerComponent.toHandleableBuilder();
    var loader = this._handlerLoader;
    var toConfig = this._toInputConfig;
    return (function(config) {
      return loader(config, componentId, builder).then((function(handler) {
        config[toConfig] = handler;
      }));
    });
  },
  get inputHandlerComponent() {
    return this.subComponents.inputHandler;
  },
  get type() {
    return 'input handler middleware';
  },
  toJson: function() {
    var json = $traceurRuntime.superGet(this, $InputHandlerMiddleware.prototype, "toJson").call(this);
    json.inputHandler = this.inputHandlerComponent.toJson();
    return json;
  }
}, {}, ConfigMiddleware);
var InputHandlerMixin = {
  inputHandler: function(handler, toConfig) {
    var options = arguments[2] !== (void 0) ? arguments[2] : {};
    return this.middleware(new InputHandlerMiddleware(handler, toConfig, options));
  },
  inputHandlers: function(handlerMap) {
    for (var key in handlerMap) {
      var handler = handlerMap[key];
      this.inputHandler(handler, key);
    }
    return this;
  }
};
var mixinInputHandler = (function(prototype) {
  return Object.assign(prototype, InputHandlerMixin);
});
mixinInputHandler(ExtensibleComponent.prototype);
var inputHandlerMiddleware = (function(handler, toConfig, options) {
  return new InputHandlerMiddleware(handler, toConfig, options);
});
