"use strict";
Object.defineProperties(exports, {
  HandlerBundle: {get: function() {
      return HandlerBundle;
    }},
  handlerBundle: {get: function() {
      return handlerBundle;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__,
    $__quiver_45_simple_45_handler__,
    $__extend__,
    $__handleable_45_builder__,
    $__handleable_45_middleware__,
    $__util_47_loader__;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var simpleToStreamHandler = ($__quiver_45_simple_45_handler__ = require("quiver-simple-handler"), $__quiver_45_simple_45_handler__ && $__quiver_45_simple_45_handler__.__esModule && $__quiver_45_simple_45_handler__ || {default: $__quiver_45_simple_45_handler__}).simpleToStreamHandler;
var extendHandler = ($__extend__ = require("./extend"), $__extend__ && $__extend__.__esModule && $__extend__ || {default: $__extend__}).extendHandler;
var HandleableBuilder = ($__handleable_45_builder__ = require("./handleable-builder"), $__handleable_45_builder__ && $__handleable_45_builder__.__esModule && $__handleable_45_builder__ || {default: $__handleable_45_builder__}).HandleableBuilder;
var handleableMiddleware = ($__handleable_45_middleware__ = require("./handleable-middleware"), $__handleable_45_middleware__ && $__handleable_45_middleware__.__esModule && $__handleable_45_middleware__ || {default: $__handleable_45_middleware__}).handleableMiddleware;
var $__5 = ($__util_47_loader__ = require("./util/loader"), $__util_47_loader__ && $__util_47_loader__.__esModule && $__util_47_loader__ || {default: $__util_47_loader__}),
    loadStreamHandler = $__5.loadStreamHandler,
    simpleHandlerLoader = $__5.simpleHandlerLoader;
let _bundleFields = Symbol('bundleFields');
let streamHandlerConverter = (function(handler) {
  return ({streamHandler: safePromised(handler)});
});
let simpleHandlerConverter = (function(inType, outType) {
  return (function(handler) {
    return ({streamHandler: simpleToStreamHandler(handler, inType, outType)});
  });
});
let bundleFieldMiddleware = (function(field, handlerConverter) {
  return handleableMiddleware(async(function*(config, builder) {
    let bundle = yield builder(config);
    let handler = bundle[field];
    if (!handler) {
      throw new Error('missing handler field in bundle: ' + field);
    }
    return handlerConverter(handler);
  }));
});
let bundleFieldComponent = (function(bundleComponent, field, handlerConverter, handlerLoader) {
  return extendHandler(bundleComponent).middleware(bundleFieldMiddleware(field, handlerConverter)).setLoader(handlerLoader);
});
var HandlerBundle = function HandlerBundle(bundleBuilder) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this[_bundleFields] = {};
  $traceurRuntime.superConstructor($HandlerBundle).call(this, bundleBuilder, options = {});
};
var $HandlerBundle = HandlerBundle;
($traceurRuntime.createClass)(HandlerBundle, {
  toHandlerComponents: function() {
    let handlerComponents = {};
    let bundleFields = this[_bundleFields];
    for (let field in bundleFields) {
      let $__7 = bundleFields[field],
          handlerConverter = $__7.handlerConverter,
          handlerLoader = $__7.handlerLoader;
      handlerComponents[field] = bundleFieldComponent(this, field, handlerConverter, handlerLoader);
    }
    return handlerComponents;
  },
  bundleField: function(handlerName, handlerConverter, handlerLoader) {
    let bundleFields = this[_bundleFields];
    if (bundleFields[handlerName])
      throw new Error('bundle field is already defined: ' + handlerName);
    bundleFields[handlerName] = {
      handlerConverter: handlerConverter,
      handlerLoader: handlerLoader
    };
    return this;
  },
  streamHandler: function(handlerName) {
    return this.bundleField(handlerName, streamHandlerConverter, loadStreamHandler);
  },
  simpleHandler: function(handlerName, inType, outType) {
    return this.bundleField(handlerName, simpleHandlerConverter(inType, outType), simpleHandlerLoader(inType, outType));
  }
}, {}, HandleableBuilder);
var handlerBundle = (function(bundleBuilder) {
  return new HandlerBundle(bundleBuilder);
});
