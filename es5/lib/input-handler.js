"use strict";
Object.defineProperties(exports, {
  InputHandlerMiddleware: {get: function() {
      return InputHandlerMiddleware;
    }},
  PrivateInputMiddleware: {get: function() {
      return PrivateInputMiddleware;
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
  this._inputHandlerComponent = handlerComponent;
  var middleware = (function(config) {
    if (config[toConfig])
      return config;
    return loader(config, handlerComponent, options).then((function(handler) {
      config[toConfig] = handler;
      return config;
    }));
  });
  $traceurRuntime.superCall(this, $InputHandlerMiddleware.prototype, "constructor", [middleware, options]);
};
var $InputHandlerMiddleware = InputHandlerMiddleware;
($traceurRuntime.createClass)(InputHandlerMiddleware, {
  get inputHandlerComponent() {
    return this._inputHandlerComponent;
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
var PrivateInputMiddleware = function PrivateInputMiddleware(handlerComponent, toConfig) {
  var options = arguments[2] !== (void 0) ? arguments[2] : {};
  options.loadPrivate = true;
  var inputMiddleware = new InputHandlerMiddleware(handlerComponent, toConfig, options);
  $traceurRuntime.superCall(this, $PrivateInputMiddleware.prototype, "constructor", [inputMiddleware]);
};
var $PrivateInputMiddleware = PrivateInputMiddleware;
($traceurRuntime.createClass)(PrivateInputMiddleware, {}, {}, PrivateMiddleware);
