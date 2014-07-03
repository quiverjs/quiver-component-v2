"use strict";
Object.defineProperties(exports, {
  ConfigMiddleware: {get: function() {
      return ConfigMiddleware;
    }},
  ConfigOverrideMiddleware: {get: function() {
      return ConfigOverrideMiddleware;
    }},
  __esModule: {value: true}
});
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var HandleableMiddleware = $traceurRuntime.assertObject(require('./handleable-middleware.js')).HandleableMiddleware;
var safeHandler = $traceurRuntime.assertObject(require('./util/wrap.js')).safeHandler;
var ConfigMiddleware = function ConfigMiddleware(configHandler) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._configHandler = configHandler;
  configHandler = safeHandler(configHandler, {});
  var middleware = (function(config, builder) {
    return configHandler(config).then(builder);
  });
  $traceurRuntime.superCall(this, $ConfigMiddleware.prototype, "constructor", [middleware, options]);
};
var $ConfigMiddleware = ConfigMiddleware;
($traceurRuntime.createClass)(ConfigMiddleware, {get type() {
    return 'config middleware';
  }}, {}, HandleableMiddleware);
var ConfigOverrideMiddleware = function ConfigOverrideMiddleware(overrideConfig) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._overrideConfig = overrideConfig;
  var configHandler = (function(config) {
    for (var key in overrideConfig) {
      config[key] = overrideConfig[key];
    }
    return config;
  });
  $traceurRuntime.superCall(this, $ConfigOverrideMiddleware.prototype, "constructor", [configHandler, options]);
};
var $ConfigOverrideMiddleware = ConfigOverrideMiddleware;
($traceurRuntime.createClass)(ConfigOverrideMiddleware, {
  get overrideConfig() {
    return copy(this._overrideConfig);
  },
  get type() {
    return 'config override middleware';
  },
  toJson: function() {
    var json = $traceurRuntime.superCall(this, $ConfigOverrideMiddleware.prototype, "toJson", []);
    json.overrideConfig = this.overrideConfig;
    return json;
  }
}, {}, ConfigMiddleware);
