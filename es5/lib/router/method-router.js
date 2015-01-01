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
var headRequestHandler = (function(handler) {
  return (function(requestHead, requestStreamable) {
    if (requestHead.method != 'HEAD') {
      return handler(requestHead, requestStreamable);
    }
    return handler(requestHead, requestStreamable).then((function($__7) {
      var $__8 = $__7,
          responseHead = $__8[0],
          responseStreamable = $__8[1];
      return ([responseHead, emptyStreamable()]);
    }));
  });
});
var optionsHandler = (function(methods) {
  var allowedMethods = methods.join(', ') + ', OPTIONS';
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
var methodMapToHttpHandler = (function(methodMap) {
  var allowedMethods = Object.keys(methodMap).join(', ');
  var methodNotAllowedResponse = (function() {
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
    var method = requestHead.method;
    var handler = methodMap[method];
    if (!handler)
      return methodNotAllowedResponse();
    return handler(requestHead, requestStreamable);
  });
});
var loadHttpHandler = async($traceurRuntime.initGeneratorFunction(function $__9(config, component) {
  var handleable;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $ctx.state = 2;
          return loadHandleable(config, component.id, component.builder);
        case 2:
          handleable = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $ctx.state = (handleable.httpHandler) ? 5 : 6;
          break;
        case 5:
          $ctx.returnValue = handleable.httpHandler;
          $ctx.state = -2;
          break;
        case 6:
          $ctx.state = (handleable.streamHandler) ? 8 : 9;
          break;
        case 8:
          $ctx.returnValue = streamToHttpHandler(handleable.streamHandler);
          $ctx.state = -2;
          break;
        case 9:
          throw error(500, 'handleable is neither stream nor http handler');
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__9, this);
}));
var loadMethodHandlers = async($traceurRuntime.initGeneratorFunction(function $__10(config, methodMap) {
  var handlerMap,
      $__11,
      $__12,
      $__13,
      $__14,
      key,
      component,
      handler;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          handlerMap = {};
          $ctx.state = 22;
          break;
        case 22:
          $__11 = [];
          $__12 = methodMap;
          for ($__13 in $__12)
            $__11.push($__13);
          $ctx.state = 18;
          break;
        case 18:
          $__14 = 0;
          $ctx.state = 16;
          break;
        case 16:
          $ctx.state = ($__14 < $__11.length) ? 8 : 14;
          break;
        case 13:
          $__14++;
          $ctx.state = 16;
          break;
        case 8:
          key = $__11[$__14];
          $ctx.state = 9;
          break;
        case 9:
          $ctx.state = (!(key in $__12)) ? 13 : 6;
          break;
        case 6:
          component = methodMap[key];
          $ctx.state = 11;
          break;
        case 11:
          $ctx.state = 2;
          return loadHttpHandler(config, component);
        case 2:
          handler = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          handlerMap[key] = handler;
          $ctx.state = 13;
          break;
        case 14:
          if (handlerMap['GET'] && !handlerMap['HEAD']) {
            handlerMap['HEAD'] = headRequestHandler(handlerMap['GET']);
          }
          if (!handlerMap['OPTIONS']) {
            handlerMap['OPTIONS'] = optionsHandler(Object.keys(handlerMap));
          }
          $ctx.state = 24;
          break;
        case 24:
          $ctx.returnValue = handlerMap;
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__10, this);
}));
var normalizeMethodMap = (function(methodMap) {
  var newMap = {};
  for (var key in methodMap) {
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
    var methodMap = this._methodMap;
    var snapshot = {};
    for (var key in methodMap) {
      var component = methodMap[key];
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
    var methodMap = this._methodMap;
    for (var key in methodMap) {
      iteratee(methodMap[key]);
    }
    $traceurRuntime.superGet(this, $MethodRouter.prototype, "each").call(this, iteratee);
  },
  doMap: function(target, mapper, mapTable) {
    var methodMap = this._methodMap;
    var newMap = {};
    for (var key in methodMap) {
      newMap[key] = mapper(methodMap[key], mapTable);
    }
    target._methodMap = newMap;
    $traceurRuntime.superGet(this, $MethodRouter.prototype, "doMap").call(this, target, mapper, mapTable);
  }
}, {}, HttpHandlerBuilder);
var methodRouter = (function(methodMap) {
  return new MethodRouter(methodMap);
});
