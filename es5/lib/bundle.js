"use strict";
Object.defineProperties(exports, {
  loadHandlerFromBundle: {get: function() {
      return loadHandlerFromBundle;
    }},
  ComponentBundle: {get: function() {
      return ComponentBundle;
    }},
  componentBundle: {get: function() {
      return componentBundle;
    }},
  __esModule: {value: true}
});
var async = $traceurRuntime.assertObject(require('quiver-promise')).async;
var Component = $traceurRuntime.assertObject(require('./component.js')).Component;
var getBundleMap = $traceurRuntime.assertObject(require('./util/config.js')).getBundleMap;
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
var bundleField = (function(handlerName, bundleComponent) {
  return handleableBuilder(bundleHandlerLoader(handlerName, bundleComponent));
});
var BundleField = function BundleField(handlerName, bundleComponent) {
  this._handlerName = handlerName;
  this._bundleComponent = bundleComponent;
};
($traceurRuntime.createClass)(BundleField, {
  get streamHandlerBuilder() {
    return bundleHandlerLoader(this._handlerName, this._bundleComponent);
  },
  makePrivate: function() {
    var privateTable = arguments[0] !== (void 0) ? arguments[0] : {};
    var handlerName = this._handlerName;
    var bundleComponent = this._bundleComponent;
    return bundleComponent.makePrivate(privateTable).handlerComponents[handlerName];
  }
}, {}, StreamHandlerBuilder);
var bundleFields = (function(handlerNames, componentBundle) {
  return handlerNames.map((function(handlerName) {
    return new BundleField(handlerName, componentBundle);
  }));
});
var ComponentBundle = function ComponentBundle(bundleBuilder, handlerNames) {
  var options = arguments[2] !== (void 0) ? arguments[2] : {};
  this._bundleBuilder = bundleBuilder;
  this._handlerNames = handlerNames;
  this._handlerComponents = bundleFields(handlerNames, this);
  $traceurRuntime.superCall(this, $ComponentBundle.prototype, "constructor", [options]);
};
var $ComponentBundle = ComponentBundle;
($traceurRuntime.createClass)(ComponentBundle, {
  get bundleBuilder() {
    return this._bundleBuilder;
  },
  get handlerNames() {
    return this._handlerNames;
  },
  get handlerComponents() {
    return this._handlerComponents;
  },
  privatize: function(privateInstance, privateTable) {
    privateInstance._handlerComponents = bundleFields(this._handlerNames, this);
    $traceurRuntime.superCall(this, $ComponentBundle.prototype, "privatize", [privateInstance, privateTable]);
  }
}, {}, Component);
var componentBundle = (function(bundleBuilder, handlerNames) {
  return new ComponentBundle(bundleBuilder, handlerNames);
});
