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
var $__quiver_45_promise__,
    $__quiver_45_simple_45_handler__,
    $__util_47_loader__,
    $__util_47_wrap__,
    $__stream_45_handler__;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var $__1 = ($__quiver_45_simple_45_handler__ = require("quiver-simple-handler"), $__quiver_45_simple_45_handler__ && $__quiver_45_simple_45_handler__.__esModule && $__quiver_45_simple_45_handler__ || {default: $__quiver_45_simple_45_handler__}),
    simpleToStreamHandler = $__1.simpleToStreamHandler,
    streamToSimpleHandler = $__1.streamToSimpleHandler,
    validateSimpleTypes = $__1.validateSimpleTypes;
var simpleHandlerLoader = ($__util_47_loader__ = require("./util/loader"), $__util_47_loader__ && $__util_47_loader__.__esModule && $__util_47_loader__ || {default: $__util_47_loader__}).simpleHandlerLoader;
var $__3 = ($__util_47_wrap__ = require("./util/wrap"), $__util_47_wrap__ && $__util_47_wrap__.__esModule && $__util_47_wrap__ || {default: $__util_47_wrap__}),
    safeBuilder = $__3.safeBuilder,
    safeHandler = $__3.safeHandler;
var $__4 = ($__stream_45_handler__ = require("./stream-handler"), $__stream_45_handler__ && $__stream_45_handler__.__esModule && $__stream_45_handler__ || {default: $__stream_45_handler__}),
    StreamHandler = $__4.StreamHandler,
    StreamHandlerBuilder = $__4.StreamHandlerBuilder;
var SimpleHandlerBuilder = function SimpleHandlerBuilder(simpleHandlerBuilder, inType, outType) {
  var options = arguments[3] !== (void 0) ? arguments[3] : {};
  var err = validateSimpleTypes([inType, outType]);
  if (err)
    throw err;
  this._inType = inType;
  this._outType = outType;
  this._simpleHandlerBuilder = safeBuilder(simpleHandlerBuilder, options);
  $traceurRuntime.superConstructor($SimpleHandlerBuilder).call(this, null, options);
};
var $SimpleHandlerBuilder = SimpleHandlerBuilder;
($traceurRuntime.createClass)(SimpleHandlerBuilder, {
  get streamHandlerBuilder() {
    var $__6 = this,
        simpleHandlerBuilder = $__6.simpleHandlerBuilder,
        inType = $__6.inType,
        outType = $__6.outType;
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
    var json = $traceurRuntime.superGet(this, $SimpleHandlerBuilder.prototype, "toJson").call(this);
    json.inType = this.inType;
    json.outType = this.outType;
    return json;
  }
}, {}, StreamHandlerBuilder);
var SimpleHandler = function SimpleHandler(simpleHandler, inType, outType) {
  var options = arguments[3] !== (void 0) ? arguments[3] : {};
  this._simpleHandler = safeHandler(simpleHandler, options);
  $traceurRuntime.superConstructor($SimpleHandler).call(this, null, inType, outType, options);
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
