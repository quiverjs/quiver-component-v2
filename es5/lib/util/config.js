"use strict";
Object.defineProperties(exports, {
  normalizeConfig: {get: function() {
      return normalizeConfig;
    }},
  getHandlerMap: {get: function() {
      return getHandlerMap;
    }},
  getInitTable: {get: function() {
      return getInitTable;
    }},
  getHandleable: {get: function() {
      return getHandleable;
    }},
  __esModule: {value: true}
});
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var configNormalized = Symbol('ConfigNormalized');
var handlerMap = Symbol('handlerMap');
var initTable = Symbol('initTable');
var normalizeConfig = (function(config) {
  if (config[configNormalized])
    return;
  if (!config[handlerMap]) {
    config[handlerMap] = new Map();
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
var getInitTable = (function(config) {
  normalizeConfig(config);
  return config[initTable];
});
var getHandleable = (function(config, key) {
  var handlerMap = getHandlerMap(config);
  return handlerMap.get(key);
});
