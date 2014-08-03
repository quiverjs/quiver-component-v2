"use strict";
Object.defineProperties(exports, {
  Protocol: {get: function() {
      return Protocol;
    }},
  __esModule: {value: true}
});
var $__1 = $traceurRuntime.assertObject(require('./component.js')),
    Component = $__1.Component,
    HandlerComponent = $__1.HandlerComponent;
var configMiddleware = $traceurRuntime.assertObject(require('./simple-middleware.js')).configMiddleware;
var $__1 = $traceurRuntime.assertObject(require('./util/loader.js')),
    loadHandleable = $__1.loadHandleable,
    loadStreamHandler = $__1.loadStreamHandler,
    loadHttpHandler = $__1.loadHttpHandler,
    simpleHandlerLoader = $__1.simpleHandlerLoader;
var async = $traceurRuntime.assertObject(require('quiver-promise')).async;
var assertInstanceOf = $traceurRuntime.assertObject(require('quiver-object')).assertInstanceOf;
var loadProtocol = async($traceurRuntime.initGeneratorFunction(function $__2(config, loaderMap) {
  var bundleResult,
      $__3,
      $__4,
      $__5,
      $__6,
      handlerName,
      loader;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          bundleResult = {};
          $ctx.state = 20;
          break;
        case 20:
          $__3 = [];
          $__4 = loaderMap;
          for ($__5 in $__4)
            $__3.push($__5);
          $ctx.state = 16;
          break;
        case 16:
          $__6 = 0;
          $ctx.state = 14;
          break;
        case 14:
          $ctx.state = ($__6 < $__3.length) ? 8 : 12;
          break;
        case 4:
          $__6++;
          $ctx.state = 14;
          break;
        case 8:
          handlerName = $__3[$__6];
          $ctx.state = 9;
          break;
        case 9:
          $ctx.state = (!(handlerName in $__4)) ? 4 : 6;
          break;
        case 6:
          loader = loaderMap[handlername];
          $ctx.state = 11;
          break;
        case 11:
          $ctx.state = 2;
          return loader(config);
        case 2:
          bundleResult[handlerName] = $ctx.sent;
          $ctx.state = 4;
          break;
        case 12:
          $ctx.returnValue = bundleResult;
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__2, this);
}));
var protocolLoader = (function(loaderMap) {
  return (function(config) {
    return loadProtocol(config, loaderMap);
  });
});
var metaProtocolLoader = (function(protocol) {
  return (function(implMap) {
    return protocol.concreteLoader(implMap);
  });
});
var metaHandlerLoader = (function(handlerLoader) {
  return (function(handlerComponent) {
    assertInstanceOf(handlerComponent, HandlerComponent, 'handler implementation must be ' + 'of type HandlerComponent');
    return (function(config) {
      return handlerLoader(config, handlerComponent);
    });
  });
});
var Protocol = function Protocol() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  this._metaLoaderMap = {};
};
var $Protocol = Protocol;
($traceurRuntime.createClass)(Protocol, {
  customHandler: function(handlerName, loader) {
    var metaLoaderMap = this._metaLoaderMap;
    if (metaLoaderMap[handlerName])
      throw new Error('Field of the same name is ' + 'already defined in protocol: ' + handlerName);
    metaLoaderMap[handlerName] = metaHandlerLoader(loader);
    return this;
  },
  handleable: function(handlerName) {
    return this.customHandler(handlerName, loadHandleable);
  },
  streamHandler: function(handlerName) {
    return this.customHandler(handlerName, loadStreamHandler);
  },
  httpHandler: function(handlerName) {
    return this.customHandler(handlerName, loadHttpHandler);
  },
  simpleHandler: function(handlerName, inType, outType) {
    return this.customHandler(handlerName, simpleHandlerLoader(inType, outType));
  },
  protocol: function(protocolName, protocol) {
    assertInstanceOf(protocol, $Protocol, 'protocol must be instance of Protocol');
    var metaLoaderMap = this._metaLoaderMap;
    if (metaLoaderMap[protocolName])
      throw new Error('Field of the same name is ' + 'already defined in protocol: ' + protocolName);
    metaLoaderMap[protocolName] = metaProtocolLoader(protocol);
    return this;
  },
  concreteLoader: function(implMap) {
    var metaLoaderMap = this._metaLoaderMap;
    var loaderMap = {};
    for (var field in metaLoaderMap) {
      var metaLoader = metaLoaderMap[field];
      var impl = implMap[field];
      loaderMap[field] = metaLoader(impl);
    }
    return protocolLoader(loaderMap);
  }
}, {}, Component);
