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
let loadHandlerFromBundle = async(function*(config, handlerName, componentId, bundleBuilder) {
  let bundleMap = getBundleMap(config);
  let bundle = bundleMap[componentId];
  if (!bundle) {
    bundle = yield bundleBuilder(config);
    bundleMap[componentId] = bundle;
  }
  let handler = bundle[handlerName];
  if (!handler)
    throw new Error('handler not found in bundle: ' + handlerName);
  return handler;
});
let bundleHandlerLoader = (function(handlerName, bundleComponent) {
  let componentId = bundleComponent.id;
  let bundleBuilder = bundleComponent.toBundleBuilder();
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
    let componentId = this.id;
    if (forkTable[componentId]) {
      return forkTable[componentId];
    }
    let handlerName = this._handlerName;
    let bundleComponent = this._bundleComponent;
    let bundleId = bundleComponent.id;
    let forkedBundle = forkTable[bundleId];
    if (!forkedBundle) {
      return bundleComponent.fork(forkTable).toHandlerComponents()[handlerName];
    }
    let forkedField = this.clone();
    forkedField._bundleComponent = forkedBundle;
    forkTable[componentId] = forkedField;
    this.doMap(forkedField, (function(component, mapTable) {
      return component.fork(mapTable);
    }), forkTable);
    return forkedField;
  }
}, {}, StreamHandlerBuilder);
let bundleFields = (function(handlerNames, bundleComponent) {
  return handlerNames.map((function(handlerName) {
    return new BundleField(handlerName, bundleComponent);
  }));
});
let streamHandlerConverter = (function(handler) {
  return safePromised(handler);
});
let simpleHandlerConverter = (function(inType, outType) {
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
    let builder = this._bundleBuilder;
    let bundleFields = this.toHandlerComponents();
    return (function(config) {
      return builder(config).then((function(bundle) {
        let convertedBundle = {};
        for (let key in bundleFields) {
          let bundleField = bundleFields[key];
          let handlerConverter = bundleField.handlerConverter;
          let handler = bundle[key];
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
    let bundleFields = this._bundleFields;
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
    let bundleFields = this._bundleFields;
    for (let key in bundleFields) {
      iteratee(bundleFields[key]);
    }
    $traceurRuntime.superGet(this, $HandlerBundle.prototype, "each").call(this, iteratee);
  },
  doMap: function(target, mapper, mapTable) {
    let bundleFields = this._bundleFields;
    let mappedFields = {};
    for (let key in bundleFields) {
      let bundleField = bundleFields[key];
      let mappedField = mapper(bundleField, mapTable);
      mappedFields[key] = mappedField;
    }
    target._bundleFields = mappedFields;
    $traceurRuntime.superGet(this, $HandlerBundle.prototype, "doMap").call(this, target, mapper, mapTable);
  },
  addMiddleware: function(middlewareComponent) {
    let bundleFields = this._bundleFields;
    for (let key in bundleFields) {
      bundleFields[key].addMiddleware(middlewareComponent);
    }
    return this;
  },
  middleware: function(middlewareComponent) {
    return this.addMiddleware(middlewareComponent);
  }
}, {}, ExtensibleHandler);
let handlerBundle = (function(bundleBuilder, handlerNames) {
  return new HandlerBundle(bundleBuilder, handlerNames);
});
