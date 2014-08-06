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
var $__2 = $traceurRuntime.assertObject(require('quiver-promise')),
    resolve = $__2.resolve,
    reject = $__2.reject;
var $__2 = $traceurRuntime.assertObject(require('quiver-simple-handler')),
    streamToSimpleHandler = $__2.streamToSimpleHandler,
    validateSimpleTypes = $__2.validateSimpleTypes;
var getHandlerMap = $traceurRuntime.assertObject(require('./config.js')).getHandlerMap;
var loadHandleable = (function(config, component) {
  var $__3;
  var options = arguments[2] !== (void 0) ? arguments[2] : {};
  var $__2 = $traceurRuntime.assertObject(options),
      loadPrivate = ($__3 = $__2.loadPrivate) === void 0 ? false : $__3;
  var handlerMap = getHandlerMap(config);
  if (!loadPrivate) {
    var handleable = handlerMap[component.id];
    if (handleable)
      return resolve(handleable);
  }
  var builder = component.handleableBuilder;
  return builder(config).then((function(handleable) {
    if (!handleable)
      return reject(new Error('handleable is not defined in builder result'));
    if (!loadPrivate)
      handlerMap[component.id] = handleable;
    return handleable;
  }));
});
var loadStreamHandler = (function() {
  for (var args = [],
      $__0 = 0; $__0 < arguments.length; $__0++)
    args[$__0] = arguments[$__0];
  return loadHandleable.apply(null, $traceurRuntime.toObject(args)).then((function(handleable) {
    var handler = handleable.streamHandler;
    if (!handler)
      return reject(new Error('handleable is not a stream handler'));
    return handler;
  }));
});
var loadHttpHandler = (function() {
  for (var args = [],
      $__1 = 0; $__1 < arguments.length; $__1++)
    args[$__1] = arguments[$__1];
  return loadHandleable.apply(null, $traceurRuntime.toObject(args)).then((function(handleable) {
    var handler = handleable.httpHandler;
    if (!handler)
      return reject(new Error('handleable is not a http handler'));
    return handler;
  }));
});
var loadSimpleHandler = (function(config, component, inType, outType, options) {
  var err = validateSimpleTypes([inType, outType]);
  if (err)
    return reject(err);
  return loadStreamHandler(config, component, options).then((function(handler) {
    return streamToSimpleHandler(handler, inType, outType);
  }));
});
var simpleHandlerLoader = (function(inType, outType) {
  return (function(config, component, options) {
    return loadSimpleHandler(config, component, inType, outType, options);
  });
});
var loadHandleableFromBundle = (function(config, handlerName, component) {});
