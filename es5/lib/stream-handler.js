"use strict";
Object.defineProperties(exports, {
  StreamHandlerBuilder: {get: function() {
      return StreamHandlerBuilder;
    }},
  StreamHandler: {get: function() {
      return StreamHandler;
    }},
  streamHandlerBuilder: {get: function() {
      return streamHandlerBuilder;
    }},
  streamHandler: {get: function() {
      return streamHandler;
    }},
  __esModule: {value: true}
});
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var loadStreamHandler = $traceurRuntime.assertObject(require('./util/loader.js')).loadStreamHandler;
var $__1 = $traceurRuntime.assertObject(require('./util/wrap.js')),
    safeBuilder = $__1.safeBuilder,
    safeHandler = $__1.safeHandler;
var HandleableBuilder = $traceurRuntime.assertObject(require('./handleable-builder.js')).HandleableBuilder;
var StreamHandlerBuilder = function StreamHandlerBuilder(streamHandlerBuilder) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._streamHandlerBuilder = streamHandlerBuilder;
  streamHandlerBuilder = safeBuilder(streamHandlerBuilder, options);
  var handleableBuilder = (function(config) {
    return streamHandlerBuilder(config).then((function(streamHandler) {
      return ({streamHandler: streamHandler});
    }));
  });
  $traceurRuntime.superCall(this, $StreamHandlerBuilder.prototype, "constructor", [handleableBuilder, options]);
};
var $StreamHandlerBuilder = StreamHandlerBuilder;
($traceurRuntime.createClass)(StreamHandlerBuilder, {
  get streamHandlerBuilder() {
    return this._streamHandlerBuilder;
  },
  get handlerLoader() {
    return loadStreamHandler;
  },
  get type() {
    return 'stream handler builder';
  }
}, {}, HandleableBuilder);
var StreamHandler = function StreamHandler(streamHandler) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._streamHandler = streamHandler;
  streamHandler = safeHandler(streamHandler, options);
  var streamHandlerBuilder = (function(config) {
    return resolve(streamHandler);
  });
  $traceurRuntime.superCall(this, $StreamHandler.prototype, "constructor", [streamHandlerBuilder, options]);
};
var $StreamHandler = StreamHandler;
($traceurRuntime.createClass)(StreamHandler, {
  get streamHandler() {
    return this._streamHandler;
  },
  get type() {
    return 'stream handler';
  }
}, {}, StreamHandlerBuilder);
var streamHandlerBuilder = (function(builder, options) {
  return new StreamHandlerBuilder(builder, options);
});
var streamHandler = (function(handler, options) {
  return new StreamHandler(handler, options);
});
