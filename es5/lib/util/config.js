"use strict";
Object.defineProperties(exports, {
  normalizeConfig: {get: function() {
      return normalizeConfig;
    }},
  getHandlerMap: {get: function() {
      return getHandlerMap;
    }},
  getBundleMap: {get: function() {
      return getBundleMap;
    }},
  getInitTable: {get: function() {
      return getInitTable;
    }},
  getHandleable: {get: function() {
      return getHandleable;
    }},
  getBundle: {get: function() {
      return getBundle;
    }},
  __esModule: {value: true}
});
var $__0 = $traceurRuntime.assertObject(require('quiver-object')),
    copy = $__0.copy,
    noCopy = $__0.noCopy;
var configNormalized = Symbol('ConfigNormalized');
var handlerMap = Symbol('handlerMap');
var bundleMap = Symbol('bundleMap');
var initTable = Symbol('initTable');
var normalizeConfig = (function(config) {
  if (config[configNormalized])
    return;
  if (!config[handlerMap]) {
    config[handlerMap] = noCopy({});
  }
  if (!config[bundleMap]) {
    config[bundleMap] = noCopy({});
  }
  if (!config[initTable]) {
    config[initTable] = {};
  }
  config[configNormalized] = true;
});
var getHandlerMap = (function(config) {
  normalizeConfig(config);
  return config[handlerMap];
});
var getBundleMap = (function(config) {
  normalizeConfig(config);
  return config[bundleMap];
});
var getInitTable = (function(config) {
  normalizeConfig(config);
  return config[initTable];
});
var getHandleable = (function(config, component) {
  var handlerMap = getHandlerMap(config);
  return handlerMap[component.id];
});
var getBundle = (function(config, component) {
  var bundleMap = getBundleMap(config);
  return bundleMap[component.id];
});
