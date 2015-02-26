"use strict";
Object.defineProperties(module.exports, {
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
    $___46__46__47_composite_47_map__,
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
var mapComponent = ($___46__46__47_composite_47_map__ = require("../composite/map"), $___46__46__47_composite_47_map__ && $___46__46__47_composite_47_map__.__esModule && $___46__46__47_composite_47_map__ || {default: $___46__46__47_composite_47_map__}).mapComponent;
var HttpHandlerBuilder = ($___46__46__47_http_45_handler__ = require("../http-handler"), $___46__46__47_http_45_handler__ && $___46__46__47_http_45_handler__.__esModule && $___46__46__47_http_45_handler__ || {default: $___46__46__47_http_45_handler__}).HttpHandlerBuilder;
var loadHandleable = ($___46__46__47_util_47_loader__ = require("../util/loader"), $___46__46__47_util_47_loader__ && $___46__46__47_util_47_loader__.__esModule && $___46__46__47_util_47_loader__ || {default: $___46__46__47_util_47_loader__}).loadHandleable;
let headRequestHandler = (function(handler) {
  return (function(requestHead, requestStreamable) {
    if (requestHead.method != 'HEAD') {
      return handler(requestHead, requestStreamable);
    }
    return handler(requestHead, requestStreamable).then((function($__15) {
      var $__17,
          $__18;
      var $__16 = $__15,
          responseHead = ($__17 = $__16[$traceurRuntime.toProperty(Symbol.iterator)](), ($__18 = $__17.next()).done ? void 0 : $__18.value),
          responseStreamable = ($__18 = $__17.next()).done ? void 0 : $__18.value;
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
let methodObjectToMap = (function(methodMap) {
  let map = new Map();
  for (let key in methodMap) {
    let handlerComponent = methodMap[key];
    if (!handlerComponent.isHandlerComponent) {
      throw new TypeError('Method map entry value must be handler component');
    }
    map.set(key.toUpperCase(), handlerComponent);
  }
  return map;
});
var MethodRouter = function MethodRouter(methodMap) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  options.safeWrapped = true;
  $traceurRuntime.superConstructor($MethodRouter).call(this, null, options);
  this.subComponents.methodMap = mapComponent(methodObjectToMap(methodMap));
};
var $MethodRouter = MethodRouter;
($traceurRuntime.createClass)(MethodRouter, {
  toHttpHandlerBuilder: function() {
    var $__16,
        $__17;
    let snapshot = {};
    let methodMap = this.subComponents.methodMap.map;
    var $__11 = true;
    var $__12 = false;
    var $__13 = undefined;
    try {
      for (var $__9,
          $__8 = (methodMap.entries())[$traceurRuntime.toProperty(Symbol.iterator)](); !($__11 = ($__9 = $__8.next()).done); $__11 = true) {
        let $__15 = $__9.value,
            key = ($__16 = $__15[$traceurRuntime.toProperty(Symbol.iterator)](), ($__17 = $__16.next()).done ? void 0 : $__17.value),
            component = ($__17 = $__16.next()).done ? void 0 : $__17.value;
        {
          snapshot[key] = {
            id: component.id,
            builder: component.toHandleableBuilder()
          };
        }
      }
    } catch ($__14) {
      $__12 = true;
      $__13 = $__14;
    } finally {
      try {
        if (!$__11 && $__8.return != null) {
          $__8.return();
        }
      } finally {
        if ($__12) {
          throw $__13;
        }
      }
    }
    return (function(config) {
      return loadMethodHandlers(config, snapshot).then(methodMapToHttpHandler);
    });
  },
  methodRoute: function(method, handlerComponent) {
    if (!handlerComponent.isHandlerComponent) {
      throw new TypeError('Method map entry value must be handler component');
    }
    this.subComponents.methodMap.set(method.toUpperCase(), handlerComponent);
  }
}, {}, HttpHandlerBuilder);
let methodRouter = (function(methodMap) {
  return new MethodRouter(methodMap);
});
