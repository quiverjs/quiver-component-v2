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
  this._streamHandlerBuilder = safeBuilder(streamHandlerBuilder, options);
  $traceurRuntime.superCall(this, $StreamHandlerBuilder.prototype, "constructor", [null, options]);
};
var $StreamHandlerBuilder = StreamHandlerBuilder;
($traceurRuntime.createClass)(StreamHandlerBuilder, {
  get mainHandleableBuilder() {
    var builder = this.streamHandlerBuilder;
    return (function(config) {
      return builder(config).then((function(streamHandler) {
        return ({streamHandler: streamHandler});
      }));
    });
  },
  get streamHandlerBuilder() {
    if (!this._streamHandlerBuilder)
      throw new Error('streamHandlerBuilder is not defined');
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
  this._streamHandler = safeHandler(streamHandler, options);
  $traceurRuntime.superCall(this, $StreamHandler.prototype, "constructor", [null, options]);
};
var $StreamHandler = StreamHandler;
($traceurRuntime.createClass)(StreamHandler, {
  get streamHandlerBuilder() {
    var handler = this.streamHandler;
    return (function(config) {
      return resolve(handler);
    });
  },
  get streamHandler() {
    if (!this._streamHandler)
      throw new Error('streamHandler is not defined');
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
