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
var $__quiver_45_promise__,
    $__util_47_loader__,
    $__util_47_wrap__,
    $__handleable_45_builder__;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var loadStreamHandler = ($__util_47_loader__ = require("./util/loader"), $__util_47_loader__ && $__util_47_loader__.__esModule && $__util_47_loader__ || {default: $__util_47_loader__}).loadStreamHandler;
var $__2 = ($__util_47_wrap__ = require("./util/wrap"), $__util_47_wrap__ && $__util_47_wrap__.__esModule && $__util_47_wrap__ || {default: $__util_47_wrap__}),
    safeBuilder = $__2.safeBuilder,
    safeHandler = $__2.safeHandler;
var HandleableBuilder = ($__handleable_45_builder__ = require("./handleable-builder"), $__handleable_45_builder__ && $__handleable_45_builder__.__esModule && $__handleable_45_builder__ || {default: $__handleable_45_builder__}).HandleableBuilder;
var StreamHandlerBuilder = function StreamHandlerBuilder(streamHandlerBuilder) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._streamHandlerBuilder = safeBuilder(streamHandlerBuilder, options);
  $traceurRuntime.superConstructor($StreamHandlerBuilder).call(this, null, options);
};
var $StreamHandlerBuilder = StreamHandlerBuilder;
($traceurRuntime.createClass)(StreamHandlerBuilder, {
  toMainHandleableBuilder: function() {
    let builder = this.toStreamHandlerBuilder();
    return (function(config) {
      return builder(config).then((function(streamHandler) {
        return ({streamHandler: streamHandler});
      }));
    });
  },
  toStreamHandlerBuilder: function() {
    if (!this._streamHandlerBuilder)
      throw new Error('streamHandlerBuilder is not defined');
    return this._streamHandlerBuilder;
  },
  get defaultLoader() {
    return loadStreamHandler;
  },
  get type() {
    return 'stream handler builder';
  }
}, {}, HandleableBuilder);
var StreamHandler = function StreamHandler(streamHandler) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._streamHandler = safeHandler(streamHandler, options);
  $traceurRuntime.superConstructor($StreamHandler).call(this, null, options);
};
var $StreamHandler = StreamHandler;
($traceurRuntime.createClass)(StreamHandler, {
  toStreamHandlerBuilder: function() {
    let handler = this.toStreamHandler();
    return (function(config) {
      return resolve(handler);
    });
  },
  toStreamHandler: function() {
    if (!this._streamHandler)
      throw new Error('streamHandler is not defined');
    return this._streamHandler;
  },
  get type() {
    return 'stream handler';
  }
}, {}, StreamHandlerBuilder);
let streamHandlerBuilder = (function(builder, options) {
  return new StreamHandlerBuilder(builder, options);
});
let streamHandler = (function(handler, options) {
  return new StreamHandler(handler, options);
});
