"use strict";
Object.defineProperties(exports, {
  loadProtocolHandlers: {get: function() {
      return loadProtocolHandlers;
    }},
  Protocol: {get: function() {
      return Protocol;
    }},
  protocol: {get: function() {
      return protocol;
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
var $__1 = $traceurRuntime.assertObject(require('quiver-object')),
    copy = $__1.copy,
    assertInstanceOf = $__1.assertInstanceOf;
var assertHandlerComponent = (function(handler) {
  return assertInstanceOf(handler, HandlerComponent, 'handler implementation must be ' + 'of type HandlerComponent');
});
var assertRepeatedField = (function(fields, fieldName) {
  if (fields[fieldName])
    throw new Error('Field of the same name is ' + 'already defined in protocol: ' + fieldName);
});
var loadProtocolHandlers = async($traceurRuntime.initGeneratorFunction(function $__2(config, implMap) {
  var handlerMap,
      $__3,
      $__4,
      $__5,
      $__6,
      key,
      $__1,
      component,
      loader;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          handlerMap = {};
          $ctx.state = 20;
          break;
        case 20:
          $__3 = [];
          $__4 = implMap;
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
          key = $__3[$__6];
          $ctx.state = 9;
          break;
        case 9:
          $ctx.state = (!(key in $__4)) ? 4 : 6;
          break;
        case 6:
          $__1 = $traceurRuntime.assertObject(implMap[key]), component = $__1.component, loader = $__1.loader;
          $ctx.state = 11;
          break;
        case 11:
          $ctx.state = 2;
          return loader(copy(config), component);
        case 2:
          handlerMap[key] = $ctx.sent;
          $ctx.state = 4;
          break;
        case 12:
          $ctx.returnValue = handlerMap;
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__2, this);
}));
var ProtocolImpl = function ProtocolImpl(implMap) {
  this._implMap = implMap;
};
var $ProtocolImpl = ProtocolImpl;
($traceurRuntime.createClass)(ProtocolImpl, {
  loadHandlers: function(config) {
    return loadProtocolHandlers(config, this._implMap);
  },
  privatize: function(privateInstance, privateTable) {
    var implMap = this._implMap;
    var newImplMap = {};
    for (var key in implMap) {
      var $__1 = $traceurRuntime.assertObject(implMap[key]),
          component = $__1.component,
          loader = $__1.loader;
      newImplMap[key] = {
        loader: loader,
        component: component.makePrivate(privateTable)
      };
    }
    privateInstance._implMap = newImplMap;
    $traceurRuntime.superCall(this, $ProtocolImpl.prototype, "privatize", [privateInstance, privateTable]);
  }
}, {}, Component);
var Protocol = function Protocol() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  this._loaderMap = [];
  this._subprotocols = [];
  $traceurRuntime.superCall(this, $Protocol.prototype, "constructor", [options]);
};
var $Protocol = Protocol;
($traceurRuntime.createClass)(Protocol, {
  customHandler: function(handlerName, loader) {
    var loaderMap = this._loaderMap;
    assertRepeatedField(loaderMap, handlerName);
    loaderMap[handlerName] = loader;
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
  subprotocol: function(protocol) {
    assertInstanceOf(protocol, $Protocol, 'protocol must be instance of Protocol');
    var subLoaders = protocol._loaderMap;
    for (var key in subLoaders) {
      this.customHandler(key, subLoaders[key]);
    }
    return this;
  },
  implement: function(implHandlers) {
    var loaderMap = this._loaderMap;
    var implMap = {};
    for (var key in loaderMap) {
      var loader = loaderMap[key];
      var component = implHandlers[key];
      if (!component)
        throw new Error('missing handler in implementation: ' + key);
      assertHandlerComponent(component);
      implMap[key] = {
        loader: loader,
        component: component
      };
    }
    return new ProtocolImpl(implMap);
  }
}, {}, Component);
var protocol = (function() {
  return new Protocol();
});
