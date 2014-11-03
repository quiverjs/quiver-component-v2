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
var $__quiver_45_object__,
    $__quiver_45_error__,
    $__quiver_45_promise__,
    $__quiver_45_simple_45_handler__,
    $__component__,
    $__stream_45_handler__,
    $__util_47_config__,
    $__util_47_loader__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var $__2 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    async = $__2.async,
    reject = $__2.reject,
    safePromised = $__2.safePromised;
var simpleToStreamHandler = ($__quiver_45_simple_45_handler__ = require("quiver-simple-handler"), $__quiver_45_simple_45_handler__ && $__quiver_45_simple_45_handler__.__esModule && $__quiver_45_simple_45_handler__ || {default: $__quiver_45_simple_45_handler__}).simpleToStreamHandler;
var Component = ($__component__ = require("./component"), $__component__ && $__component__.__esModule && $__component__ || {default: $__component__}).Component;
var StreamHandlerBuilder = ($__stream_45_handler__ = require("./stream-handler"), $__stream_45_handler__ && $__stream_45_handler__.__esModule && $__stream_45_handler__ || {default: $__stream_45_handler__}).StreamHandlerBuilder;
var getBundleMap = ($__util_47_config__ = require("./util/config"), $__util_47_config__ && $__util_47_config__.__esModule && $__util_47_config__ || {default: $__util_47_config__}).getBundleMap;
var $__7 = ($__util_47_loader__ = require("./util/loader"), $__util_47_loader__ && $__util_47_loader__.__esModule && $__util_47_loader__ || {default: $__util_47_loader__}),
    loadStreamHandler = $__7.loadStreamHandler,
    simpleHandlerLoader = $__7.simpleHandlerLoader;
var loadHandlerFromBundle = async($traceurRuntime.initGeneratorFunction(function $__9(config, handlerName, component) {
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
  }, $__9, this);
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
