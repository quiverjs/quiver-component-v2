"use strict";
Object.defineProperties(exports, {
  globalConfig: {get: function() {
      return globalConfig;
    }},
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
var $__quiver_45_object__;
var $__0 = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}),
    copy = $__0.copy,
    noCopy = $__0.noCopy;
var configNormalized = Symbol('ConfigNormalized');
var handlerMap = Symbol('handlerMap');
var bundleMap = Symbol('bundleMap');
var initTable = Symbol('initTable');
var globalConfig = (function(config) {
  if (!config.global) {
    config.global = noCopy({});
  }
  return config.global;
});
var normalizeConfig = (function(config) {
  var global = globalConfig(config);
  if (global[configNormalized])
    return;
  if (!global[handlerMap]) {
    global[handlerMap] = noCopy({});
  }
  if (!global[bundleMap]) {
    global[bundleMap] = noCopy({});
  }
  if (!global[initTable]) {
    global[initTable] = {};
  }
  global[configNormalized] = true;
  return config;
});
var getHandlerMap = (function(config) {
  normalizeConfig(config);
  return config.global[handlerMap];
});
var getBundleMap = (function(config) {
  normalizeConfig(config);
  return config.global[bundleMap];
});
var getInitTable = (function(config) {
  normalizeConfig(config);
  return config.global[initTable];
});
var getHandleable = (function(config, component) {
  var handlerMap = getHandlerMap(config);
  return handlerMap[component.id];
});
var getBundle = (function(config, component) {
  var bundleMap = getBundleMap(config);
  return bundleMap[component.id];
});
