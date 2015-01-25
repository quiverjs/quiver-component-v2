"use strict";
Object.defineProperties(exports, {
  MethodRouter: {get: function() {
      return MethodRouter;
    }},
  methodRouter: {get: function() {
      return methodRouter;
    }},
  __esModule: {value: true}
});
var $__quiver_45_error__,
    $__quiver_45_promise__,
    $__quiver_45_stream_45_util__,
    $__quiver_45_http__,
    $___46__46__47_http_45_handler__,
    $___46__46__47_util_47_loader__;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var $__1 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    resolve = $__1.resolve,
    async = $__1.async;
var emptyStreamable = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}).emptyStreamable;
var $__3 = ($__quiver_45_http__ = require("quiver-http"), $__quiver_45_http__ && $__quiver_45_http__.__esModule && $__quiver_45_http__ || {default: $__quiver_45_http__}),
    ResponseHead = $__3.ResponseHead,
    streamToHttpHandler = $__3.streamToHttpHandler;
var HttpHandlerBuilder = ($___46__46__47_http_45_handler__ = require("../http-handler"), $___46__46__47_http_45_handler__ && $___46__46__47_http_45_handler__.__esModule && $___46__46__47_http_45_handler__ || {default: $___46__46__47_http_45_handler__}).HttpHandlerBuilder;
var loadHandleable = ($___46__46__47_util_47_loader__ = require("../util/loader"), $___46__46__47_util_47_loader__ && $___46__46__47_util_47_loader__.__esModule && $___46__46__47_util_47_loader__ || {default: $___46__46__47_util_47_loader__}).loadHandleable;
let headRequestHandler = (function(handler) {
  return (function(requestHead, requestStreamable) {
    if (requestHead.method != 'HEAD') {
      return handler(requestHead, requestStreamable);
    }
    return handler(requestHead, requestStreamable).then((function($__7) {
      var $__9,
          $__10;
      var $__8 = $__7,
          responseHead = ($__9 = $__8[$traceurRuntime.toProperty(Symbol.iterator)](), ($__10 = $__9.next()).done ? void 0 : $__10.value),
          responseStreamable = ($__10 = $__9.next()).done ? void 0 : $__10.value;
      return ([responseHead, emptyStreamable()]);
    }));
  });
});
let optionsHandler = (function(methods) {
  let allowedMethods = methods.join(', ') + ', OPTIONS';
  return (function(requestHead, requestStreamable) {
    return resolve([new ResponseHead({
      statusCode: 200,
      headers: {
        'content-length': '0',
        allow: allowedMethods
      }
    }), emptyStreamable()]);
  });
});
let methodMapToHttpHandler = (function(methodMap) {
  let allowedMethods = Object.keys(methodMap).join(', ');
  let methodNotAllowedResponse = (function() {
    return ([new ResponseHead({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
      headers: {
        'content-length': '0',
        allow: allowedMethods
      }
    }), emptyStreamable()]);
  });
  return (function(requestHead, requestStreamable) {
    let method = requestHead.method;
    let handler = methodMap[method];
    if (!handler)
      return methodNotAllowedResponse();
    return handler(requestHead, requestStreamable);
  });
});
let loadHttpHandler = async(function*(config, component) {
  let handleable = yield loadHandleable(config, component.id, component.builder);
  if (handleable.httpHandler)
    return handleable.httpHandler;
  if (handleable.streamHandler)
    return streamToHttpHandler(handleable.streamHandler);
  throw error(500, 'handleable is neither stream nor http handler');
});
let loadMethodHandlers = async(function*(config, methodMap) {
  let handlerMap = {};
  for (let key in methodMap) {
    let component = methodMap[key];
    let handler = yield loadHttpHandler(config, component);
    handlerMap[key] = handler;
  }
  if (handlerMap['GET'] && !handlerMap['HEAD']) {
    handlerMap['HEAD'] = headRequestHandler(handlerMap['GET']);
  }
  if (!handlerMap['OPTIONS']) {
    handlerMap['OPTIONS'] = optionsHandler(Object.keys(handlerMap));
  }
  return handlerMap;
});
let normalizeMethodMap = (function(methodMap) {
  let newMap = {};
  for (let key in methodMap) {
    newMap[key.toUpperCase()] = methodMap[key];
  }
  return newMap;
});
var MethodRouter = function MethodRouter(methodMap) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._methodMap = normalizeMethodMap(methodMap);
  options.safeWrapped = true;
  $traceurRuntime.superConstructor($MethodRouter).call(this, null, options);
};
var $MethodRouter = MethodRouter;
($traceurRuntime.createClass)(MethodRouter, {
  toHttpHandlerBuilder: function() {
    let methodMap = this._methodMap;
    let snapshot = {};
    for (let key in methodMap) {
      let component = methodMap[key];
      snapshot[key] = {
        id: component.id,
        builder: component.toHandleableBuilder()
      };
    }
    return (function(config) {
      return loadMethodHandlers(config, snapshot).then(methodMapToHttpHandler);
    });
  },
  each: function(iteratee) {
    let methodMap = this._methodMap;
    for (let key in methodMap) {
      iteratee(methodMap[key]);
    }
    $traceurRuntime.superGet(this, $MethodRouter.prototype, "each").call(this, iteratee);
  },
  doMap: function(target, mapper, mapTable) {
    let methodMap = this._methodMap;
    let newMap = {};
    for (let key in methodMap) {
      newMap[key] = mapper(methodMap[key], mapTable);
    }
    target._methodMap = newMap;
    $traceurRuntime.superGet(this, $MethodRouter.prototype, "doMap").call(this, target, mapper, mapTable);
  }
}, {}, HttpHandlerBuilder);
let methodRouter = (function(methodMap) {
  return new MethodRouter(methodMap);
});
