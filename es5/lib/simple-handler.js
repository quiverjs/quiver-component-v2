"use strict";
Object.defineProperties(exports, {
  SimpleHandlerBuilder: {get: function() {
      return SimpleHandlerBuilder;
    }},
  SimpleHandler: {get: function() {
      return SimpleHandler;
    }},
  __esModule: {value: true}
});
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var $__2 = $traceurRuntime.assertObject(require('quiver-simple-handler')),
    simpleToStreamHandler = $__2.simpleToStreamHandler,
    streamToSimpleHandler = $__2.streamToSimpleHandler,
    validateSimpleTypes = $__2.validateSimpleTypes;
var $__2 = $traceurRuntime.assertObject(require('./stream-handler.js')),
    StreamHandler = $__2.StreamHandler,
    StreamHandlerBuilder = $__2.StreamHandlerBuilder;
var SimpleHandlerBuilder = function SimpleHandlerBuilder(simpleHandlerBuilder) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  var $__2 = $traceurRuntime.assertObject(options),
      inType = $__2.inType,
      outType = $__2.outType;
  validateSimpleTypes([inType, outType]);
  this._inType = inType;
  this._outType = outType;
  this._simpleHandlerBuilder = simpleHandlerBuilder;
  var streamHandlerBuilder = (function(config) {
    return resolve(simpleHandlerBuilder(config)).then((function(simpleHandler) {
      return simpleToStreamHandler(simpleHandler, inType, outType);
    }));
  });
  $traceurRuntime.superCall(this, $SimpleHandlerBuilder.prototype, "constructor", [streamHandlerBuilder, options]);
};
var $SimpleHandlerBuilder = SimpleHandlerBuilder;
($traceurRuntime.createClass)(SimpleHandlerBuilder, {loadHandler: function(config, options) {
    var $__0 = this;
    return $traceurRuntime.superCall(this, $SimpleHandlerBuilder.prototype, "loadHandler", [config, options]).then((function(streamHandler) {
      return streamToSimpleHandler(streamHandler, $__0._inType, $__0._outType);
    }));
  }}, {}, StreamHandlerBuilder);
var SimpleHandler = function SimpleHandler(simpleHandler) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  if (typeof(simpleHandler) != 'function') {
    throw new TypeError('must construct with simple handler function');
  }
  this._simpleHandler = simpleHandler;
  var simpleHandlerBuilder = (function(config) {
    return resolve(simpleHandler);
  });
  $traceurRuntime.superCall(this, $SimpleHandler.prototype, "constructor", [simpleHandlerBuilder, options]);
};
var $SimpleHandler = SimpleHandler;
($traceurRuntime.createClass)(SimpleHandler, {}, {}, SimpleHandlerBuilder);
