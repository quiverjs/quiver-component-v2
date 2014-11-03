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
var $__component__,
    $__simple_45_middleware__,
    $__util_47_loader__,
    $__quiver_45_promise__,
    $__quiver_45_object__;
var $__0 = ($__component__ = require("./component"), $__component__ && $__component__.__esModule && $__component__ || {default: $__component__}),
    Component = $__0.Component,
    HandlerComponent = $__0.HandlerComponent;
var configMiddleware = ($__simple_45_middleware__ = require("./simple-middleware"), $__simple_45_middleware__ && $__simple_45_middleware__.__esModule && $__simple_45_middleware__ || {default: $__simple_45_middleware__}).configMiddleware;
var $__2 = ($__util_47_loader__ = require("./util/loader"), $__util_47_loader__ && $__util_47_loader__.__esModule && $__util_47_loader__ || {default: $__util_47_loader__}),
    loadHandleable = $__2.loadHandleable,
    loadStreamHandler = $__2.loadStreamHandler,
    loadHttpHandler = $__2.loadHttpHandler,
    simpleHandlerLoader = $__2.simpleHandlerLoader;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var $__4 = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}),
    copy = $__4.copy,
    assertInstanceOf = $__4.assertInstanceOf;
var assertHandlerComponent = (function(handler) {
  return assertInstanceOf(handler, HandlerComponent, 'handler implementation must be ' + 'of type HandlerComponent');
});
var assertRepeatedField = (function(fields, fieldName) {
  if (fields[fieldName])
    throw new Error('Field of the same name is ' + 'already defined in protocol: ' + fieldName);
});
var loadProtocolHandlers = async($traceurRuntime.initGeneratorFunction(function $__7(config, implMap) {
  var handlerMap,
      $__8,
      $__9,
      $__10,
      $__11,
      key,
      $__6,
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
          $__8 = [];
          $__9 = implMap;
          for ($__10 in $__9)
            $__8.push($__10);
          $ctx.state = 16;
          break;
        case 16:
          $__11 = 0;
          $ctx.state = 14;
          break;
        case 14:
          $ctx.state = ($__11 < $__8.length) ? 8 : 12;
          break;
        case 4:
          $__11++;
          $ctx.state = 14;
          break;
        case 8:
          key = $__8[$__11];
          $ctx.state = 9;
          break;
        case 9:
          $ctx.state = (!(key in $__9)) ? 4 : 6;
          break;
        case 6:
          $__6 = implMap[key], component = $__6.component, loader = $__6.loader;
          $ctx.state = 11;
          break;
        case 11:
          $ctx.state = 2;
          return loader(config, component);
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
  }, $__7, this);
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
      var $__6 = implMap[key],
          component = $__6.component,
          loader = $__6.loader;
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
