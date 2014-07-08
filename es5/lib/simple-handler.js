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
var $__1 = $traceurRuntime.assertObject(require('quiver-simple-handler')),
    simpleToStreamHandler = $__1.simpleToStreamHandler,
    streamToSimpleHandler = $__1.streamToSimpleHandler,
    validateSimpleTypes = $__1.validateSimpleTypes;
var loadSimpleHandler = $traceurRuntime.assertObject(require('./util/loader.js')).loadSimpleHandler;
var $__1 = $traceurRuntime.assertObject(require('./util/wrap.js')),
    safeBuilder = $__1.safeBuilder,
    safeHandler = $__1.safeHandler;
var $__1 = $traceurRuntime.assertObject(require('./stream-handler.js')),
    StreamHandler = $__1.StreamHandler,
    StreamHandlerBuilder = $__1.StreamHandlerBuilder;
var simpleHandlerLoader = (function(inType, outType) {
  return (function(config, component, options) {
    return loadSimpleHandler(config, component, inType, outType, options);
  });
});
var SimpleHandlerBuilder = function SimpleHandlerBuilder(simpleHandlerBuilder, inType, outType) {
  var options = arguments[3] !== (void 0) ? arguments[3] : {};
  var err = validateSimpleTypes([inType, outType]);
  if (err)
    throw err;
  this._inType = inType;
  this._outType = outType;
  this._simpleHandlerBuilder = simpleHandlerBuilder;
  simpleHandlerBuilder = safeBuilder(simpleHandlerBuilder, options);
  var streamHandlerBuilder = (function(config) {
    return resolve(simpleHandlerBuilder(config)).then((function(simpleHandler) {
      return simpleToStreamHandler(simpleHandler, inType, outType);
    }));
  });
  $traceurRuntime.superCall(this, $SimpleHandlerBuilder.prototype, "constructor", [streamHandlerBuilder, options]);
};
var $SimpleHandlerBuilder = SimpleHandlerBuilder;
($traceurRuntime.createClass)(SimpleHandlerBuilder, {
  get handlerLoader() {
    return simpleHandlerLoader(this.inType, this.outType);
  },
  get inType() {
    return this._inType;
  },
  get outType() {
    return this._outType;
  },
  get type() {
    return 'simple handler builder';
  },
  toJson: function() {
    var json = $traceurRuntime.superCall(this, $SimpleHandlerBuilder.prototype, "toJson", []);
    json.inType = this.inType;
    json.outType = this.outType;
    return json;
  }
}, {}, StreamHandlerBuilder);
var SimpleHandler = function SimpleHandler(simpleHandler, inType, outType) {
  var options = arguments[3] !== (void 0) ? arguments[3] : {};
  this._simpleHandler = simpleHandler;
  simpleHandler = safeHandler(simpleHandler, options);
  var simpleHandlerBuilder = (function(config) {
    return resolve(simpleHandler);
  });
  $traceurRuntime.superCall(this, $SimpleHandler.prototype, "constructor", [simpleHandlerBuilder, inType, outType, options]);
};
var $SimpleHandler = SimpleHandler;
($traceurRuntime.createClass)(SimpleHandler, {get type() {
    return 'simple handler';
  }}, {}, SimpleHandlerBuilder);
