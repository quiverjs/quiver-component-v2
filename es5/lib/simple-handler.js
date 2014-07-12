"use strict";
Object.defineProperties(exports, {
  SimpleHandlerBuilder: {get: function() {
      return SimpleHandlerBuilder;
    }},
  SimpleHandler: {get: function() {
      return SimpleHandler;
    }},
  simpleHandlerBuilder: {get: function() {
      return simpleHandlerBuilder;
    }},
  simpleHandler: {get: function() {
      return simpleHandler;
    }},
  __esModule: {value: true}
});
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var $__1 = $traceurRuntime.assertObject(require('quiver-simple-handler')),
    simpleToStreamHandler = $__1.simpleToStreamHandler,
    streamToSimpleHandler = $__1.streamToSimpleHandler,
    validateSimpleTypes = $__1.validateSimpleTypes;
var simpleHandlerLoader = $traceurRuntime.assertObject(require('./util/loader.js')).simpleHandlerLoader;
var $__1 = $traceurRuntime.assertObject(require('./util/wrap.js')),
    safeBuilder = $__1.safeBuilder,
    safeHandler = $__1.safeHandler;
var $__1 = $traceurRuntime.assertObject(require('./stream-handler.js')),
    StreamHandler = $__1.StreamHandler,
    StreamHandlerBuilder = $__1.StreamHandlerBuilder;
var SimpleHandlerBuilder = function SimpleHandlerBuilder(simpleHandlerBuilder, inType, outType) {
  var options = arguments[3] !== (void 0) ? arguments[3] : {};
  var err = validateSimpleTypes([inType, outType]);
  if (err)
    throw err;
  this._inType = inType;
  this._outType = outType;
  this._simpleHandlerBuilder = safeBuilder(simpleHandlerBuilder, options);
  $traceurRuntime.superCall(this, $SimpleHandlerBuilder.prototype, "constructor", [null, options]);
};
var $SimpleHandlerBuilder = SimpleHandlerBuilder;
($traceurRuntime.createClass)(SimpleHandlerBuilder, {
  get streamHandlerBuilder() {
    var $__1 = this,
        simpleHandlerBuilder = $__1.simpleHandlerBuilder,
        inType = $__1.inType,
        outType = $__1.outType;
    return (function(config) {
      return simpleHandlerBuilder(config).then((function(simpleHandler) {
        return simpleToStreamHandler(simpleHandler, inType, outType);
      }));
    });
  },
  get simpleHandlerBuilder() {
    if (!this._simpleHandlerBuilder)
      throw new Error('simpleHandlerBuilder is not define');
    return this._simpleHandlerBuilder;
  },
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
  this._simpleHandler = safeHandler(simpleHandler, options);
  $traceurRuntime.superCall(this, $SimpleHandler.prototype, "constructor", [null, inType, outType, options]);
};
var $SimpleHandler = SimpleHandler;
($traceurRuntime.createClass)(SimpleHandler, {
  get simpleHandlerBuilder() {
    var simpleHandler = this.simpleHandler;
    return (function(config) {
      return resolve(simpleHandler);
    });
  },
  get simpleHandler() {
    if (!this._simpleHandler)
      throw new Error('simpleHandler is not defined');
    return this._simpleHandler;
  },
  get type() {
    return 'simple handler';
  }
}, {}, SimpleHandlerBuilder);
var simpleHandlerBuilder = (function(builder, inType, outType, options) {
  return new SimpleHandlerBuilder(builder, inType, outType, options);
});
var simpleHandler = (function(handler, inType, outType, options) {
  return new SimpleHandler(handler, inType, outType, options);
});
