"use strict";
Object.defineProperties(exports, {
  InputHandlerMiddleware: {get: function() {
      return InputHandlerMiddleware;
    }},
  __esModule: {value: true}
});
var HandlerComponent = $traceurRuntime.assertObject(require('./component.js')).HandlerComponent;
var HandleableMiddleware = $traceurRuntime.assertObject(require('./handleable-middleware.js')).HandleableMiddleware;
var InputHandlerMiddleware = function InputHandlerMiddleware(handlerComponent, toConfig) {
  var options = arguments[2] !== (void 0) ? arguments[2] : {};
  var loadOptions = $traceurRuntime.assertObject(options).loadOptions;
  if (!(handlerComponent instanceof HandlerComponent)) {
    throw new TypeError('input handler component must be of type HandlerComponent');
  }
  if (typeof(toConfig) != 'string') {
    throw new TypeError('toConfig required to be string');
  }
  this._inputHandlerComponent = handlerComponent;
  var middleware = (function(config, builder) {
    if (config[toConfig])
      return builder(config);
    return handlerComponent.loadHandler(config, loadOptions).then((function(handler) {
      config[toConfig] = handler;
      return builder(config);
    }));
  });
  $traceurRuntime.superCall(this, $InputHandlerMiddleware.prototype, "constructor", [middleware, options]);
};
var $InputHandlerMiddleware = InputHandlerMiddleware;
($traceurRuntime.createClass)(InputHandlerMiddleware, {get inputHandlerComponent() {
    return this._inputHandlerComponent;
  }}, {}, HandleableMiddleware);
