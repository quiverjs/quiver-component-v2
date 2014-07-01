"use strict";
Object.defineProperties(exports, {
  normalizeConfig: {get: function() {
      return normalizeConfig;
    }},
  getHandlerMap: {get: function() {
      return getHandlerMap;
    }},
  getHandleable: {get: function() {
      return getHandleable;
    }},
  __esModule: {value: true}
});
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var configNormalizedKey = 'quiverConfigNormalized';
var handlerMapKey = 'quiverHandleables';
var normalizeConfig = (function(config) {
  if (config[configNormalizedKey])
    return;
  if (!config[handlerMapKey]) {
    config[handlerMapKey] = new Map();
  }
  config[configNormalizedKey] = true;
});
var getHandlerMap = (function(config) {
  normalizeConfig(config);
  return config[handlerMapKey];
});
var getHandleable = (function(config, key) {
  var handlerMap = getHandlerMap(config);
  return handlerMap.get(key);
});
