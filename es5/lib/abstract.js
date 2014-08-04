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
    HandlerComponent = $__1.HandlerComponent,
    MiddlewareComponent = $__1.MiddlewareComponent;
var async = $traceurRuntime.assertObject(require('quiver-promise')).async;
var assertInstanceOf = $traceurRuntime.assertObject(require('quiver-object')).assertInstanceOf;
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
    return async($traceurRuntime.initGeneratorFunction(function $__2(config) {
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $ctx.state = 2;
              return protocolImpl.load(config);
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
    }));
  },
  privatize: function(privateCopy, bundle) {
    privateCopy._protocolImpl = this._protocolImpl.makePrivate(bundle);
    $traceurRuntime.superCall(this, $ProtocolMiddleware.prototype, "privatize", [privateCopy, bundle]);
  }
}, {}, ConfigMiddleware);
var abstractComponent = (function(configKey, protocol, component) {
  assertInstanceOf(protocol, Protocol, 'protocol must be instance of Protocol');
  if (!(component instanceof HandlerComponent || component instanceof MiddlewareComponent)) {
    throw new Error('component must be either handler or middleware');
  }
  return (function(implBundle) {
    var protocolImpl = protocol.implement(implBundle);
    var protocolMiddleware = new ProtocolMiddleware(configKey, protocolImpl);
    var concreteComponent = component.makePrivate().addMiddleware(protocolMiddleware);
    return concreteComponent;
  });
});
