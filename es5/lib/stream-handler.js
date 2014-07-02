"use strict";
Object.defineProperties(exports, {
  StreamHandlerBuilder: {get: function() {
      return StreamHandlerBuilder;
    }},
  StreamHandler: {get: function() {
      return StreamHandler;
    }},
  __esModule: {value: true}
});
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var loadStreamHandler = $traceurRuntime.assertObject(require('./util/loader.js')).loadStreamHandler;
var $__1 = $traceurRuntime.assertObject(require('./util/wrap.js')),
    safeBuilder = $__1.safeBuilder,
    safeHandler = $__1.safeHandler;
var HandleableBuilder = $traceurRuntime.assertObject(require('./handleable-builder.js')).HandleableBuilder;
var streamToHandleableBuilder = (function(streamBuilder) {
  return (function(config) {
    return resolve(streamBuilder(config)).then((function(streamHandler) {
      return ({get streamHandler() {
          return streamHandler;
        }});
    }));
  });
});
var StreamHandlerBuilder = function StreamHandlerBuilder(streamHandlerBuilder) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._streamHandlerBuilder = streamHandlerBuilder;
  streamHandlerBuilder = safeBuilder(streamHandlerBuilder, options);
  var handleableBuilder = streamToHandleableBuilder(streamHandlerBuilder);
  $traceurRuntime.superCall(this, $StreamHandlerBuilder.prototype, "constructor", [handleableBuilder, options]);
};
var $StreamHandlerBuilder = StreamHandlerBuilder;
($traceurRuntime.createClass)(StreamHandlerBuilder, {
  get streamHandlerBuilder() {
    return this._streamHandlerBuilder;
  },
  loadStreamHandler: function(config, options) {
    return loadStreamHandler(config, this, this.handleableBuilder, options);
  },
  loadHandler: function(config, options) {
    return this.loadStreamHandler(config, options);
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
($traceurRuntime.createClass)(StreamHandler, {get streamHandler() {
    return this._streamHandler;
  }}, {}, StreamHandlerBuilder);
