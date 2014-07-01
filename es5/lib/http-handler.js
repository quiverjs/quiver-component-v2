"use strict";
Object.defineProperties(exports, {
  httpToHandleableBuilder: {get: function() {
      return httpToHandleableBuilder;
    }},
  HttpHandlerBuilder: {get: function() {
      return HttpHandlerBuilder;
    }},
  HttpHandler: {get: function() {
      return HttpHandler;
    }},
  __esModule: {value: true}
});
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var loadHttpHandler = $traceurRuntime.assertObject(require('./util/loader.js')).loadHttpHandler;
var HandleableBuilder = $traceurRuntime.assertObject(require('./handleable-builder.js')).HandleableBuilder;
var httpToHandleableBuilder = (function(httpBuilder) {
  return (function(config) {
    return resolve(httpBuilder(config)).then((function(httpHandler) {
      return ({get httpHandler() {
          return httpHandler;
        }});
    }));
  });
});
var HttpHandlerBuilder = function HttpHandlerBuilder(httpHandlerBuilder) {
  this._httpHandlerBuilder = httpHandlerBuilder;
  var handleableBuilder = httpToHandleableBuilder(httpHandlerBuilder);
  $traceurRuntime.superCall(this, $HttpHandlerBuilder.prototype, "constructor", [handleableBuilder]);
};
var $HttpHandlerBuilder = HttpHandlerBuilder;
($traceurRuntime.createClass)(HttpHandlerBuilder, {
  get httpHandlerBuilder() {
    return this._httpHandlerBuilder;
  },
  loadHttpHandler: function(config) {
    var options = arguments[1] !== (void 0) ? arguments[1] : {};
    return loadHttpHandler(config, this, options);
  },
  loadHandler: function(config, options) {
    return loadHttpHandler(config, options);
  }
}, {}, HandleableBuilder);
var HttpHandler = function HttpHandler(httpHandler, options) {
  this._httpHandler = httpHandler;
  var httpHandlerBuilder = (function(config) {
    return resolve(httpHandler);
  });
  $traceurRuntime.superCall(this, $HttpHandler.prototype, "constructor", [httpHandlerBuilder, options]);
};
var $HttpHandler = HttpHandler;
($traceurRuntime.createClass)(HttpHandler, {get httpHandler() {
    return this._httpHandler;
  }}, {}, HttpHandlerBuilder);
