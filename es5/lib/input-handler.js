"use strict";
Object.defineProperties(exports, {
  InputHandlerMiddleware: {get: function() {
      return InputHandlerMiddleware;
    }},
  __esModule: {value: true}
});
var HandlerComponent = $traceurRuntime.assertObject(require('./handler.js')).HandlerComponent;
var HandleableMiddleware = $traceurRuntime.assertObject(require('./handleable-middleware.js')).HandleableMiddleware;
var InputHandlerMiddleware = function InputHandlerMiddleware(handlerComponent) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  var loadOptions = $traceurRuntime.assertObject(options).loadOptions;
  if (!(handlerComponent instanceof HandlerComponent)) {
    throw new TypeError('input handler component must be of type HandlerComponent');
  }
  this._handlerComponent = handlerComponent;
  var middleware = (function(config, builder) {
    return handlerComponent.loadHandler(config, loadOptions).then(builder);
  });
  $traceurRuntime.superCall(this, $InputHandlerMiddleware.prototype, "constructor", [middleware, options]);
};
var $InputHandlerMiddleware = InputHandlerMiddleware;
($traceurRuntime.createClass)(InputHandlerMiddleware, {}, {}, HandleableMiddleware);
