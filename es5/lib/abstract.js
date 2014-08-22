"use strict";
Object.defineProperties(exports, {
  abstractComponent: {get: function() {
      return abstractComponent;
    }},
  __esModule: {value: true}
});
var Protocol = $traceurRuntime.assertObject(require('./protocol.js')).Protocol;
var ConfigMiddleware = $traceurRuntime.assertObject(require('./simple-middleware.js')).ConfigMiddleware;
var $__1 = $traceurRuntime.assertObject(require('./component.js')),
    Component = $__1.Component,
    HandlerComponent = $__1.HandlerComponent,
    MiddlewareComponent = $__1.MiddlewareComponent;
var async = $traceurRuntime.assertObject(require('quiver-promise')).async;
var assertInstanceOf = $traceurRuntime.assertObject(require('quiver-object')).assertInstanceOf;
var assertHandlerComponent = (function(handler) {
  return assertInstanceOf(handler, HandlerComponent, 'handler implementation must be ' + 'of type HandlerComponent');
});
var protocolMiddleware = (function(configKey, loader) {
  return configMiddleware(async($traceurRuntime.initGeneratorFunction(function $__2(config) {
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.state = 2;
            return loader(config);
          case 2:
            config[configKey] = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.returnValue = config;
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__2, this);
  })));
});
var ProtocolMiddleware = function ProtocolMiddleware(configKey, protocolImpl) {
  var options = arguments[2] !== (void 0) ? arguments[2] : {};
  this._configKey = configKey;
  this._protocolImpl = protocolImpl;
  options.safeWrapped = true;
  $traceurRuntime.superCall(this, $ProtocolMiddleware.prototype, "constructor", [null, options]);
};
var $ProtocolMiddleware = ProtocolMiddleware;
($traceurRuntime.createClass)(ProtocolMiddleware, {
  get configHandler() {
    var configKey = this._configKey;
    var protocolImpl = this._protocolImpl;
    return (function(config) {
      return protocolImpl.loadHandlers(config).then((function(handlerMap) {
        config[configKey] = handlerMap;
        return config;
      }));
    });
  },
  privatize: function(privateInstance, privateTable) {
    privateInstance._protocolImpl = this._protocolImpl.makePrivate(privateTable);
    $traceurRuntime.superCall(this, $ProtocolMiddleware.prototype, "privatize", [privateInstance, privateTable]);
  }
}, {}, ConfigMiddleware);
var AbstractComponent = function AbstractComponent(configKey, protocol, component) {
  assertInstanceOf(protocol, Protocol, 'protocol must be instance of Protocol');
  if (!(component instanceof HandlerComponent || component instanceof MiddlewareComponent)) {
    throw new Error('component must be either handler or middleware');
  }
  this._configKey = configKey;
  this._protocol = protocol;
  this._component = component;
  this._implBundle = {};
  $traceurRuntime.superCall(this, $AbstractComponent.prototype, "constructor", []);
};
var $AbstractComponent = AbstractComponent;
($traceurRuntime.createClass)(AbstractComponent, {
  implement: function(handlerMap) {
    var privateTable = arguments[1] !== (void 0) ? arguments[1] : {};
    var privateCopy = this.makePrivate(privateTable);
    var implBundle = privateCopy._implBundle;
    for (var key in handlerMap) {
      var component = handlerMap[key];
      assertHandlerComponent(component);
      implBundle[key] = component;
    }
    return privateCopy;
  },
  privatize: function(privateInstance, privateTable) {
    var newImpl = {};
    var implBundle = this._implBundle;
    for (var key in implBundle) {
      newImpl[key] = implBundle[key].makePrivate(privateTable);
    }
    privateInstance._implBundle = newImpl;
    $traceurRuntime.superCall(this, $AbstractComponent.prototype, "privatize", [privateInstance, privateTable]);
  },
  concretize: function() {
    var configKey = this._configKey;
    var protocol = this._protocol;
    var component = this._component;
    var implBundle = this._implBundle;
    var protocolImpl = protocol.implement(implBundle);
    var protocolMiddleware = new ProtocolMiddleware(configKey, protocolImpl);
    var concreteComponent = component.makePrivate().addMiddleware(protocolMiddleware);
    return concreteComponent;
  },
  get rawComponent() {
    return this._component;
  }
}, {}, Component);
var abstractComponent = (function(configKey, protocol, component) {
  return new AbstractComponent(configKey, protocol, component);
});
