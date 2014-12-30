"use strict";
Object.defineProperties(exports, {
  loadHandleable: {get: function() {
      return loadHandleable;
    }},
  loadStreamHandler: {get: function() {
      return loadStreamHandler;
    }},
  loadHttpHandler: {get: function() {
      return loadHttpHandler;
    }},
  loadSimpleHandler: {get: function() {
      return loadSimpleHandler;
    }},
  simpleHandlerLoader: {get: function() {
      return simpleHandlerLoader;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__,
    $__quiver_45_simple_45_handler__,
    $__config__;
var $__0 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    resolve = $__0.resolve,
    reject = $__0.reject;
var $__1 = ($__quiver_45_simple_45_handler__ = require("quiver-simple-handler"), $__quiver_45_simple_45_handler__ && $__quiver_45_simple_45_handler__.__esModule && $__quiver_45_simple_45_handler__ || {default: $__quiver_45_simple_45_handler__}),
    streamToSimpleHandler = $__1.streamToSimpleHandler,
    validateSimpleTypes = $__1.validateSimpleTypes;
var getHandlerMap = ($__config__ = require("./config"), $__config__ && $__config__.__esModule && $__config__ || {default: $__config__}).getHandlerMap;
var loadHandleable = (function(config, componentId, builder) {
  var handlerMap = getHandlerMap(config);
  var handleable = handlerMap[componentId];
  if (handleable)
    return resolve(handleable);
  return builder(config).then((function(handleable) {
    if (!handleable)
      return reject(new Error('handleable is not defined in builder result'));
    handlerMap[componentId] = handleable;
    return handleable;
  }));
});
var loadStreamHandler = (function() {
  for (var args = [],
      $__3 = 0; $__3 < arguments.length; $__3++)
    args[$__3] = arguments[$__3];
  return loadHandleable.apply(null, $traceurRuntime.spread(args)).then((function(handleable) {
    var handler = handleable.streamHandler;
    if (!handler)
      return reject(new Error('handleable is not a stream handler'));
    return handler;
  }));
});
var loadHttpHandler = (function() {
  for (var args = [],
      $__4 = 0; $__4 < arguments.length; $__4++)
    args[$__4] = arguments[$__4];
  return loadHandleable.apply(null, $traceurRuntime.spread(args)).then((function(handleable) {
    var handler = handleable.httpHandler;
    if (!handler)
      return reject(new Error('handleable is not a http handler'));
    return handler;
  }));
});
var loadSimpleHandler = (function(config, componentId, builder, inType, outType) {
  var err = validateSimpleTypes([inType, outType]);
  if (err)
    return reject(err);
  return loadStreamHandler(config, componentId, builder).then((function(handler) {
    return streamToSimpleHandler(handler, inType, outType);
  }));
});
var simpleHandlerLoader = (function(inType, outType) {
  return (function(config, componentId, builder) {
    return loadSimpleHandler(config, componentId, builder, inType, outType);
  });
});
