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
    $__extensible_45_component__,
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
var ExtensibleHandler = ($__extensible_45_component__ = require("./extensible-component"), $__extensible_45_component__ && $__extensible_45_component__.__esModule && $__extensible_45_component__ || {default: $__extensible_45_component__}).ExtensibleHandler;
var StreamHandlerBuilder = ($__stream_45_handler__ = require("./stream-handler"), $__stream_45_handler__ && $__stream_45_handler__.__esModule && $__stream_45_handler__ || {default: $__stream_45_handler__}).StreamHandlerBuilder;
var getBundleMap = ($__util_47_config__ = require("./util/config"), $__util_47_config__ && $__util_47_config__.__esModule && $__util_47_config__ || {default: $__util_47_config__}).getBundleMap;
var $__8 = ($__util_47_loader__ = require("./util/loader"), $__util_47_loader__ && $__util_47_loader__.__esModule && $__util_47_loader__ || {default: $__util_47_loader__}),
    loadStreamHandler = $__8.loadStreamHandler,
    simpleHandlerLoader = $__8.simpleHandlerLoader;
var loadHandlerFromBundle = async($traceurRuntime.initGeneratorFunction(function $__10(config, handlerName, componentId, bundleBuilder) {
  var bundleMap,
      bundle,
      handler;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          bundleMap = getBundleMap(config);
          bundle = bundleMap[componentId];
          $ctx.state = 11;
          break;
        case 11:
          $ctx.state = (!bundle) ? 1 : 6;
          break;
        case 1:
          $ctx.state = 2;
          return bundleBuilder(config);
        case 2:
          bundle = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          bundleMap[componentId] = bundle;
          $ctx.state = 6;
          break;
        case 6:
          handler = bundle[handlerName];
          if (!handler)
            throw new Error('handler not found in bundle: ' + handlerName);
          $ctx.state = 13;
          break;
        case 13:
          $ctx.returnValue = handler;
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__10, this);
}));
var bundleHandlerLoader = (function(handlerName, bundleComponent) {
  var componentId = bundleComponent.id;
  var bundleBuilder = bundleComponent.toBundleBuilder();
  return (function(config) {
    return loadHandlerFromBundle(config, handlerName, componentId, bundleBuilder);
  });
});
var BundleField = function BundleField(handlerName, bundleComponent, handlerConverter, handlerLoader) {
  var options = arguments[4] !== (void 0) ? arguments[4] : {};
  this._handlerName = handlerName;
  this._bundleComponent = bundleComponent;
  this._handlerConverter = handlerConverter;
  this._handlerLoader = handlerLoader;
  options.safeWrapped = true;
  $traceurRuntime.superConstructor($BundleField).call(this, null, options);
};
var $BundleField = BundleField;
($traceurRuntime.createClass)(BundleField, {
  toStreamHandlerBuilder: function() {
    return bundleHandlerLoader(this._handlerName, this._bundleComponent);
  },
  get handlerConverter() {
    return this._handlerConverter;
  },
  get defaultLoader() {
    return this._handlerLoader;
  },
  fork: function() {
    var forkTable = arguments[0] !== (void 0) ? arguments[0] : {};
    var componentId = this.id;
    if (forkTable[componentId]) {
      return forkTable[componentId];
    }
    var handlerName = this._handlerName;
    var bundleComponent = this._bundleComponent;
    var bundleId = bundleComponent.id;
    var forkedBundle = forkTable[bundleId];
    if (!forkedBundle) {
      return bundleComponent.fork(forkTable).toHandlerComponents()[handlerName];
    }
    var forkedField = this.clone();
    forkedField._bundleComponent = forkedBundle;
    forkTable[componentId] = forkedField;
    this.doMap(forkedField, (function(component) {
      return component.fork(forkTable);
    }));
    return forkedField;
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
  $traceurRuntime.superConstructor($HandlerBundle).call(this, options);
};
var $HandlerBundle = HandlerBundle;
($traceurRuntime.createClass)(HandlerBundle, {
  toHandleableBuilder: function() {
    return this.toBundleBuilder();
  },
  toBundleBuilder: function() {
    var builder = this._bundleBuilder;
    var bundleFields = this.toHandlerComponents();
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
  toHandlerComponents: function() {
    return this._bundleFields;
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
  each: function(iteratee) {
    var bundleFields = this._bundleFields;
    for (var key in bundleFields) {
      iteratee(bundleFields[key]);
    }
    $traceurRuntime.superGet(this, $HandlerBundle.prototype, "each").call(this, iteratee);
  },
  doMap: function(target, mapper) {
    var bundleFields = this._bundleFields;
    var mappedFields = {};
    for (var key in bundleFields) {
      var bundleField = bundleFields[key];
      var mappedField = mapper(bundleField);
      mappedFields[key] = mappedField;
    }
    target._bundleFields = mappedFields;
    $traceurRuntime.superGet(this, $HandlerBundle.prototype, "doMap").call(this, target, mapper);
  },
  addMiddleware: function(middlewareComponent) {
    var bundleFields = this._bundleFields;
    for (var key in bundleFields) {
      bundleFields[key].addMiddleware(middlewareComponent);
    }
    return this;
  },
  middleware: function(middlewareComponent) {
    return this.addMiddleware(middlewareComponent);
  }
}, {}, ExtensibleHandler);
var handlerBundle = (function(bundleBuilder, handlerNames) {
  return new HandlerBundle(bundleBuilder, handlerNames);
});
