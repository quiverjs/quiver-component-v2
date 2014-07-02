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
  __esModule: {value: true}
});
var $__2 = $traceurRuntime.assertObject(require('quiver-promise')),
    resolve = $__2.resolve,
    reject = $__2.reject;
var $__2 = $traceurRuntime.assertObject(require('quiver-simple-handler')),
    streamToSimpleHandler = $__2.streamToSimpleHandler,
    validateSimpleTypes = $__2.validateSimpleTypes;
var getHandlerMap = $traceurRuntime.assertObject(require('./config.js')).getHandlerMap;
var loadHandleable = (function(config, key, builder) {
  var options = arguments[3] !== (void 0) ? arguments[3] : {};
  var handlerMap = getHandlerMap(config);
  var handleable = handlerMap.get(key);
  if (handleable)
    return resolve(handleable);
  return builder(config).then((function(handleable) {
    if (!handleable)
      return reject(new Error('handleable is not defined in builder result'));
    handlerMap.set(key, handleable);
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
var loadSimpleHandler = (function(config, key, builder) {
  var options = arguments[3] !== (void 0) ? arguments[3] : {};
  var $__2 = $traceurRuntime.assertObject(options),
      inType = $__2.inType,
      outType = $__2.outType;
  var err = validateSimpleTypes([inType, outType]);
  if (err)
    return reject(err);
  return loadStreamHandler(config, key, builder, options).then((function(handler) {
    return streamToSimpleHandler(handler, inType, outType);
  }));
});
