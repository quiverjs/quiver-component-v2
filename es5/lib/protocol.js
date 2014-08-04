"use strict";
Object.defineProperties(exports, {
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
var assertInstanceOf = $traceurRuntime.assertObject(require('quiver-object')).assertInstanceOf;
var assertHandlerComponent = (function(handler) {
  return assertInstanceOf(handler, HandlerComponent, 'handler implementation must be ' + 'of type HandlerComponent');
});
var assertRepeatedField = (function(fields, fieldName) {
  if (fields[fieldName])
    throw new Error('Field of the same name is ' + 'already defined in protocol: ' + fieldName);
});
var loadProtocol = async($traceurRuntime.initGeneratorFunction(function $__2(config, implMap) {
  var bundleResult,
      $__3,
      $__4,
      $__5,
      $__6,
      implName,
      impl;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          bundleResult = {};
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
          implName = $__3[$__6];
          $ctx.state = 9;
          break;
        case 9:
          $ctx.state = (!(implName in $__4)) ? 4 : 6;
          break;
        case 6:
          impl = implMap[implName];
          $ctx.state = 11;
          break;
        case 11:
          $ctx.state = 2;
          return impl.load(config);
        case 2:
          bundleResult[implName] = $ctx.sent;
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
var HandlerProtocolImpl = function HandlerProtocolImpl(handlerComponent, handlerLoader) {
  assertHandlerComponent(handlerComponent);
  this._handlerLoader = handlerLoader;
  this._handlerComponent = handlerComponent;
};
($traceurRuntime.createClass)(HandlerProtocolImpl, {
  load: function(config) {
    return this._handlerLoader(config, this._handlerComponent);
  },
  privatize: function(privateCopy, bundle) {
    privateCopy._handlerComponent = this._handlerComponent.makePrivate(bundle);
  }
}, {}, Component);
var ProtocolImpl = function ProtocolImpl(implMap) {
  this._implMap = implMap;
};
($traceurRuntime.createClass)(ProtocolImpl, {
  load: function(config) {
    return loadProtocol(config, this._implMap);
  },
  privatize: function(privatecopy, bundle) {
    var implMap = this._implMap;
    var privateImplMap = {};
    for (var implName in implMap) {
      privateImplMap[implName] = implMap[implName].makePrivate(bundle);
    }
    privateCopy._implMap = privateImplMap;
  }
}, {}, Component);
var Protocol = function Protocol() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  this._fields = {};
  $traceurRuntime.superCall(this, $Protocol.prototype, "constructor", [options]);
};
var $Protocol = Protocol;
($traceurRuntime.createClass)(Protocol, {
  customHandler: function(handlerName, loader) {
    var fields = this._fields;
    assertRepeatedField(fields, handlerName);
    fields[handlerName] = (function(handlerComponent) {
      return new HandlerProtocolImpl(handlerComponent, loader);
    });
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
  subprotocol: function(protocolName, protocol) {
    assertInstanceOf(protocol, $Protocol, 'protocol must be instance of Protocol');
    var fields = this._fields;
    assertRepeatedField(fields, protocolName);
    fields[protocolName] = (function(implBundle) {
      return protocol.implement(implBundle);
    });
    return this;
  },
  implement: function(implBundle) {
    var fields = this._fields;
    var implMap = {};
    for (var fieldName in fields) {
      var field = fields[fieldName];
      var impl = implBundle[fieldName];
      if (!impl)
        throw new Error('missing field in implementation: ' + fieldName);
      implMap[fieldName] = field(impl);
    }
    return new ProtocolImpl(implMap);
  }
}, {}, Component);
var protocol = (function() {
  return new Protocol();
});
