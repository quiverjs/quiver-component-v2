"use strict";
Object.defineProperties(exports, {
  loadHandlerFromBundle: {get: function() {
      return loadHandlerFromBundle;
    }},
  HandlerBundle: {get: function() {
      return HandlerBundle;
    }},
  handlerBundle: {get: function() {
      return handlerBundle;
    }},
  __esModule: {value: true}
});
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var error = $traceurRuntime.assertObject(require('quiver-error')).error;
var $__1 = $traceurRuntime.assertObject(require('quiver-promise')),
    async = $__1.async,
    reject = $__1.reject,
    safePromised = $__1.safePromised;
var simpleToStreamHandler = $traceurRuntime.assertObject(require('quiver-simple-handler')).simpleToStreamHandler;
var Component = $traceurRuntime.assertObject(require('./component.js')).Component;
var StreamHandlerBuilder = $traceurRuntime.assertObject(require('./stream-handler.js')).StreamHandlerBuilder;
var getBundleMap = $traceurRuntime.assertObject(require('./util/config.js')).getBundleMap;
var $__1 = $traceurRuntime.assertObject(require('./util/loader.js')),
    loadStreamHandler = $__1.loadStreamHandler,
    simpleHandlerLoader = $__1.simpleHandlerLoader;
var loadHandlerFromBundle = async($traceurRuntime.initGeneratorFunction(function $__2(config, handlerName, component) {
  var componentId,
      bundleMap,
      bundle,
      bundleBuilder,
      handler;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          componentId = component.id;
          bundleMap = getBundleMap(config);
          bundle = bundleMap[componentId];
          $ctx.state = 13;
          break;
        case 13:
          $ctx.state = (!bundle) ? 5 : 8;
          break;
        case 5:
          bundleBuilder = component.bundleBuilder;
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return bundleBuilder(config);
        case 2:
          bundle = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          bundleMap[componentId] = bundle;
          $ctx.state = 8;
          break;
        case 8:
          handler = bundle[handlerName];
          if (!handler)
            throw new Error('handler not found in bundle: ' + handlerName);
          $ctx.state = 15;
          break;
        case 15:
          $ctx.returnValue = handler;
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__2, this);
}));
var bundleHandlerLoader = (function(handlerName, bundleComponent) {
  return (function(config) {
    return loadHandlerFromBundle(config, handlerName, bundleComponent);
  });
});
var BundleField = function BundleField(handlerName, bundleComponent, handlerConverter, handlerLoader) {
  var options = arguments[4] !== (void 0) ? arguments[4] : {};
  this._handlerName = handlerName;
  this._bundleComponent = bundleComponent;
  this._handlerConverter = handlerConverter;
  this._handlerLoader = handlerLoader;
  options.safeWrapped = true;
  $traceurRuntime.superCall(this, $BundleField.prototype, "constructor", [null, options]);
};
var $BundleField = BundleField;
($traceurRuntime.createClass)(BundleField, {
  get streamHandlerBuilder() {
    return bundleHandlerLoader(this._handlerName, this._bundleComponent);
  },
  get handlerConverter() {
    return this._handlerConverter;
  },
  get handlerLoader() {
    return this._handlerLoader;
  },
  makePrivate: function() {
    var privateTable = arguments[0] !== (void 0) ? arguments[0] : {};
    var handlerName = this._handlerName;
    var bundleComponent = this._bundleComponent;
    return bundleComponent.makePrivate(privateTable).handlerComponents[handlerName];
  },
  _makePrivate: function() {
    var privateTable = arguments[0] !== (void 0) ? arguments[0] : {};
    return $traceurRuntime.superCall(this, $BundleField.prototype, "makePrivate", [privateTable]);
  }
}, {}, StreamHandlerBuilder);
var bundleFields = (function(handlerNames, bundleComponent) {
  return handlerNames.map((function(handlerName) {
    return new BundleField(handlerName, bundleComponent);
  }));
});
var streamHandlerConverter = (function(handler) {
  return safePromised(handler);
});
var simpleHandlerConverter = (function(inType, outType) {
  return (function(handler) {
    return simpleToStreamHandler(handler, inType, outType);
  });
});
var HandlerBundle = function HandlerBundle(bundleBuilder) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._bundleBuilder = safePromised(bundleBuilder);
  this._bundleFields = {};
  $traceurRuntime.superCall(this, $HandlerBundle.prototype, "constructor", [options]);
};
var $HandlerBundle = HandlerBundle;
($traceurRuntime.createClass)(HandlerBundle, {
  get bundleBuilder() {
    var builder = this._bundleBuilder;
    var bundleFields = this.handlerComponents;
    return (function(config) {
      return builder(config).then((function(bundle) {
        var convertedBundle = {};
        for (var key in bundleFields) {
          var bundleField = bundleFields[key];
          var handlerConverter = bundleField.handlerConverter;
          var handler = bundle[key];
          if (!handler)
            return reject(error(500, 'required handler not found ' + 'in bundle result: ' + key));
          convertedBundle[key] = handlerConverter(handler);
        }
        return convertedBundle;
      }));
    });
  },
  get handlerComponents() {
    return copy(this._bundleFields);
  },
  bundleField: function(handlerName, handlerConverter, handlerLoader) {
    var bundleFields = this._bundleFields;
    if (bundleFields[handlerName])
      throw new Error('bundle field is already defined: ' + handlerName);
    bundleFields[handlerName] = new BundleField(handlerName, this, handlerConverter, handlerLoader);
    return this;
  },
  streamHandler: function(handlerName) {
    return this.bundleField(handlerName, streamHandlerConverter, loadStreamHandler);
  },
  simpleHandler: function(handlerName, inType, outType) {
    return this.bundleField(handlerName, simpleHandlerConverter(inType, outType), simpleHandlerLoader(inType, outType));
  },
  privatize: function(privateInstance, privateTable) {
    var bundleFields = this._bundleFields;
    var privateFields = {};
    for (var key in bundleFields) {
      var bundleField = bundleFields[key];
      var privateField = bundleField._makePrivate(privateTable);
      privateField._bundleComponent = privateInstance;
      privateFields[key] = privateField;
    }
    privateInstance._bundleFields = privateFields;
    $traceurRuntime.superCall(this, $HandlerBundle.prototype, "privatize", [privateInstance, privateTable]);
  },
  addMiddleware: function(middleware) {
    var bundleFields = this._bundleFields;
    for (var key in bundleFields) {
      bundleFields[key].addMiddleware(middleware);
    }
    return this;
  }
}, {}, Component);
var handlerBundle = (function(bundleBuilder, handlerNames) {
  return new HandlerBundle(bundleBuilder, handlerNames);
});
