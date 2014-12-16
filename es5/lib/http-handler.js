"use strict";
Object.defineProperties(exports, {
  HttpHandlerBuilder: {get: function() {
      return HttpHandlerBuilder;
    }},
  HttpHandler: {get: function() {
      return HttpHandler;
    }},
  httpHandlerBuilder: {get: function() {
      return httpHandlerBuilder;
    }},
  httpHandler: {get: function() {
      return httpHandler;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__,
    $__util_47_loader__,
    $__util_47_wrap__,
    $__handleable_45_builder__;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var loadHttpHandler = ($__util_47_loader__ = require("./util/loader"), $__util_47_loader__ && $__util_47_loader__.__esModule && $__util_47_loader__ || {default: $__util_47_loader__}).loadHttpHandler;
var $__2 = ($__util_47_wrap__ = require("./util/wrap"), $__util_47_wrap__ && $__util_47_wrap__.__esModule && $__util_47_wrap__ || {default: $__util_47_wrap__}),
    safeBuilder = $__2.safeBuilder,
    safeHandler = $__2.safeHandler;
var HandleableBuilder = ($__handleable_45_builder__ = require("./handleable-builder"), $__handleable_45_builder__ && $__handleable_45_builder__.__esModule && $__handleable_45_builder__ || {default: $__handleable_45_builder__}).HandleableBuilder;
var HttpHandlerBuilder = function HttpHandlerBuilder(httpHandlerBuilder) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._httpHandlerBuilder = safeBuilder(httpHandlerBuilder, options);
  $traceurRuntime.superConstructor($HttpHandlerBuilder).call(this, null, options);
};
var $HttpHandlerBuilder = HttpHandlerBuilder;
($traceurRuntime.createClass)(HttpHandlerBuilder, {
  get mainHandleableBuilder() {
    var builder = this.httpHandlerBuilder;
    return (function(config) {
      return builder(config).then((function(httpHandler) {
        return ({httpHandler: httpHandler});
      }));
    });
  },
  get httpHandlerBuilder() {
    if (!this._httpHandlerBuilder)
      throw new Error('httpHandlerBuilder is not defined');
    return this._httpHandlerBuilder;
  },
  get handlerLoader() {
    return loadHttpHandler;
  },
  get type() {
    return 'Http Handler Builder';
  }
}, {}, HandleableBuilder);
var HttpHandler = function HttpHandler(httpHandler) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._httpHandler = safeHandler(httpHandler, options);
  $traceurRuntime.superConstructor($HttpHandler).call(this, null, options);
};
var $HttpHandler = HttpHandler;
($traceurRuntime.createClass)(HttpHandler, {
  get httpHandlerBuilder() {
    var handler = this.httpHandler;
    return (function(config) {
      return resolve(handler);
    });
  },
  get httpHandler() {
    if (!this._httpHandler)
      throw new Error('httpHandler is not defined');
    return this._httpHandler;
  },
  get type() {
    return 'Http Handler';
  }
}, {}, HttpHandlerBuilder);
var httpHandlerBuilder = (function(builder, options) {
  return new HttpHandlerBuilder(builder, options);
});
var httpHandler = (function(handler, options) {
  return new HttpHandler(handler, options);
});
