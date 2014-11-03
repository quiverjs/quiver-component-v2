"use strict";
Object.defineProperties(exports, {
  abstractComponent: {get: function() {
      return abstractComponent;
    }},
  __esModule: {value: true}
});
var $__protocol__,
    $__simple_45_middleware__,
    $__component__,
    $__quiver_45_promise__,
    $__quiver_45_object__;
var Protocol = ($__protocol__ = require("./protocol"), $__protocol__ && $__protocol__.__esModule && $__protocol__ || {default: $__protocol__}).Protocol;
var ConfigMiddleware = ($__simple_45_middleware__ = require("./simple-middleware"), $__simple_45_middleware__ && $__simple_45_middleware__.__esModule && $__simple_45_middleware__ || {default: $__simple_45_middleware__}).ConfigMiddleware;
var $__2 = ($__component__ = require("./component"), $__component__ && $__component__.__esModule && $__component__ || {default: $__component__}),
    Component = $__2.Component,
    HandlerComponent = $__2.HandlerComponent,
    MiddlewareComponent = $__2.MiddlewareComponent;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var assertInstanceOf = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).assertInstanceOf;
var assertHandlerComponent = (function(handler) {
  return assertInstanceOf(handler, HandlerComponent, 'handler implementation must be ' + 'of type HandlerComponent');
});
var protocolMiddleware = (function(configKey, loader) {
  return configMiddleware(async($traceurRuntime.initGeneratorFunction(function $__7(config) {
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
    }, $__7, this);
  })));
});
var ProtocolMiddleware = function ProtocolMiddleware(configKey, protocolImpl) {
  var options = arguments[2] !== (void 0) ? arguments[2] : {};
  this._configKey = configKey;
  options.safeWrapped = true;
  $traceurRuntime.superCall(this, $ProtocolMiddleware.prototype, "constructor", [null, options]);
  this.subComponents.protocolImpl = protocolImpl;
};
var $ProtocolMiddleware = ProtocolMiddleware;
($traceurRuntime.createClass)(ProtocolMiddleware, {get configHandler() {
    var configKey = this._configKey;
    var protocolImpl = this.subComponents.protocolImpl;
    return (function(config) {
      return protocolImpl.loadHandlers(config).then((function(handlerMap) {
        config[configKey] = handlerMap;
        return config;
      }));
    });
  }}, {}, ConfigMiddleware);
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
