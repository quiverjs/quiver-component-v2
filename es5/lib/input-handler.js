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
var $__1 = $traceurRuntime.assertObject(require('quiver-object')),
    assertInstanceOf = $__1.assertInstanceOf,
    assertString = $__1.assertString;
var HandlerComponent = $traceurRuntime.assertObject(require('./component.js')).HandlerComponent;
var ConfigMiddleware = $traceurRuntime.assertObject(require('./simple-middleware.js')).ConfigMiddleware;
var PrivateMiddleware = $traceurRuntime.assertObject(require('./private-middleware.js')).PrivateMiddleware;
var loadHandler = (function(config, component, options) {
  return component.loadHandler(config, options);
});
var InputHandlerMiddleware = function InputHandlerMiddleware(handlerComponent, toConfig) {
  var $__2;
  var options = arguments[2] !== (void 0) ? arguments[2] : {};
  assertInstanceOf(handlerComponent, HandlerComponent, 'input handler must be of type HandlerComponent');
  assertString(toConfig, 'toConfig required to be string');
  var $__1 = $traceurRuntime.assertObject(options),
      loader = ($__2 = $__1.loader) === void 0 ? loadHandler : $__2;
  this._handlerLoader = loader;
  this._inputHandlerComponent = handlerComponent;
  this._toInputConfig = toConfig;
  options.safeWrapped = true;
  $traceurRuntime.superCall(this, $InputHandlerMiddleware.prototype, "constructor", [null, options]);
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
    return this._inputHandlerComponent;
  },
  privatize: function(privateCopy, bundle) {
    privateCopy._inputHandlerComponent = this._inputHandlerComponent.makePrivate(bundle);
    $traceurRuntime.superCall(this, $InputHandlerMiddleware.prototype, "privatize", [privateCopy, bundle]);
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
