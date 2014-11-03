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
    $__component__,
    $__simple_45_middleware__;
var $__0 = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}),
    assertInstanceOf = $__0.assertInstanceOf,
    assertString = $__0.assertString;
var HandlerComponent = ($__component__ = require("./component"), $__component__ && $__component__.__esModule && $__component__ || {default: $__component__}).HandlerComponent;
var ConfigMiddleware = ($__simple_45_middleware__ = require("./simple-middleware"), $__simple_45_middleware__ && $__simple_45_middleware__.__esModule && $__simple_45_middleware__ || {default: $__simple_45_middleware__}).ConfigMiddleware;
var loadHandler = (function(config, component, options) {
  return component.loadHandler(config, options);
});
var InputHandlerMiddleware = function InputHandlerMiddleware(handlerComponent, toConfig) {
  var $__5;
  var options = arguments[2] !== (void 0) ? arguments[2] : {};
  assertInstanceOf(handlerComponent, HandlerComponent, 'input handler must be of type HandlerComponent');
  assertString(toConfig, 'toConfig required to be string');
  var $__4 = options,
      loader = ($__5 = $__4.loader) === void 0 ? loadHandler : $__5;
  this._handlerLoader = loader;
  this._toInputConfig = toConfig;
  options.safeWrapped = true;
  $traceurRuntime.superCall(this, $InputHandlerMiddleware.prototype, "constructor", [null, options]);
  this.subComponents.inputHandler = handlerComponent;
};
var $InputHandlerMiddleware = InputHandlerMiddleware;
($traceurRuntime.createClass)(InputHandlerMiddleware, {
  get configHandler() {
    var handlerComponent = this.inputHandlerComponent;
    var loader = this._handlerLoader;
    var toConfig = this._toInputConfig;
    return (function(config) {
      return loader(config, handlerComponent).then((function(handler) {
        config[toConfig] = handler;
        return config;
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
    var json = $traceurRuntime.superCall(this, $InputHandlerMiddleware.prototype, "toJson", []);
    json.inputHandler = this.inputHandlerComponent.toJson();
    return json;
  }
}, {}, ConfigMiddleware);
var inputHandlerMiddleware = (function(handler, toConfig, options) {
  return new InputHandlerMiddleware(handler, toConfig, options);
});
