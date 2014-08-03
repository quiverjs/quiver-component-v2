"use strict";
Object.defineProperties(exports, {
  abstractComponent: {get: function() {
      return abstractComponent;
    }},
  __esModule: {value: true}
});
var Protocol = $traceurRuntime.assertObject(require('./protocol.js')).Protocol;
var HandlerComponent = $traceurRuntime.assertObject(require('./component.js')).HandlerComponent;
var configMiddleware = $traceurRuntime.assertObject(require('./simple-middleware.js')).configMiddleware;
var async = $traceurRuntime.assertObject(require('quiver-promise')).async;
var assertInstanceOf = $traceurRuntime.assertObject(require('quiver-object')).assertInstanceOf;
var protocolMiddleware = (function(configKey, loader) {
  return configMiddleware(async($traceurRuntime.initGeneratorFunction(function $__1(config) {
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
    }, $__1, this);
  })));
});
var abstractComponent = (function(protocol, configKey, component) {
  assertInstanceOf(protocol, Protocol, 'protocol must be instance of Protocol');
  if (!(component instanceof HandlerComponent || component instanceof MiddlewareComponent)) {
    throw new Error('component must be either handler or middleware');
  }
  return (function(implMap) {
    var loader = protocol.concreteLoader(implMap);
    var concreteComponent = component.makePrivate().addMiddleware(protocolMiddleware(configKey, loader));
    return concreteComponent;
  });
});
