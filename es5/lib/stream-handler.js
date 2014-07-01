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
  this._streamHandlerBuilder = streamHandlerBuilder;
  var handleableBuilder = streamToHandleableBuilder(streamHandlerBuilder);
  $traceurRuntime.superCall(this, $StreamHandlerBuilder.prototype, "constructor", [handleableBuilder]);
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
var StreamHandler = function StreamHandler(streamHandler, options) {
  this._streamHandler = streamHandler;
  var streamHandlerBuilder = (function(config) {
    return resolve(streamHandler);
  });
  $traceurRuntime.superCall(this, $StreamHandler.prototype, "constructor", [streamHandlerBuilder, options]);
};
var $StreamHandler = StreamHandler;
($traceurRuntime.createClass)(StreamHandler, {get streamHandler() {
    return this._streamHandler;
  }}, {}, StreamHandlerBuilder);
