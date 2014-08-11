"use strict";
Object.defineProperties(exports, {
  ConfigMiddleware: {get: function() {
      return ConfigMiddleware;
    }},
  ConfigOverrideMiddleware: {get: function() {
      return ConfigOverrideMiddleware;
    }},
  ConfigAliasMiddleware: {get: function() {
      return ConfigAliasMiddleware;
    }},
  configMiddleware: {get: function() {
      return configMiddleware;
    }},
  configOverrideMiddleware: {get: function() {
      return configOverrideMiddleware;
    }},
  configAliasMiddleware: {get: function() {
      return configAliasMiddleware;
    }},
  __esModule: {value: true}
});
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var HandleableMiddleware = $traceurRuntime.assertObject(require('./handleable-middleware.js')).HandleableMiddleware;
var safeHandler = $traceurRuntime.assertObject(require('./util/wrap.js')).safeHandler;
var ConfigMiddleware = function ConfigMiddleware(configHandler) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._configHandler = safeHandler(configHandler, options);
  $traceurRuntime.superCall(this, $ConfigMiddleware.prototype, "constructor", [null, options]);
};
var $ConfigMiddleware = ConfigMiddleware;
($traceurRuntime.createClass)(ConfigMiddleware, {
  get mainMiddleware() {
    var configHandler = this.configHandler;
    return (function(config, builder) {
      return configHandler(config).then(builder);
    });
  },
  get configHandler() {
    if (!this._configHandler)
      throw new Error('configHandler is not defined');
    return this._configHandler;
  },
  get type() {
    return 'config middleware';
  }
}, {}, HandleableMiddleware);
var ConfigOverrideMiddleware = function ConfigOverrideMiddleware(overrideConfig) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._overrideConfig = overrideConfig;
  options.safeWrapped = true;
  $traceurRuntime.superCall(this, $ConfigOverrideMiddleware.prototype, "constructor", [null, options]);
};
var $ConfigOverrideMiddleware = ConfigOverrideMiddleware;
($traceurRuntime.createClass)(ConfigOverrideMiddleware, {
  get configHandler() {
    var overrideConfig = this.overrideConfig;
    return (function(config) {
      for (var key in overrideConfig) {
        config[key] = overrideConfig[key];
      }
      return resolve(config);
    });
  },
  get overrideConfig() {
    return this._overrideConfig;
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
var ConfigAliasMiddleware = function ConfigAliasMiddleware(aliasConfig) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._aliasConfig = aliasConfig;
  options.safeWrapped = true;
  $traceurRuntime.superCall(this, $ConfigAliasMiddleware.prototype, "constructor", [null, options]);
};
var $ConfigAliasMiddleware = ConfigAliasMiddleware;
($traceurRuntime.createClass)(ConfigAliasMiddleware, {
  get configHandler() {
    var aliasConfig = this._aliasConfig;
    return (function(config) {
      for (var key in aliasConfig) {
        var aliasKey = aliasConfig[key];
        config[key] = config[aliasKey];
      }
      return resolve(config);
    });
  },
  get aliasConfig() {
    return copy(this._aliasConfig);
  },
  get type() {
    return 'config alias middleware';
  },
  toJson: function() {
    var json = $traceurRuntime.superCall(this, $ConfigAliasMiddleware.prototype, "toJson", []);
    json.aliasConfig = this.aliasConfig;
    return json;
  }
}, {}, ConfigMiddleware);
var configMiddleware = (function(handler, options) {
  return new ConfigMiddleware(handler, options);
});
var configOverrideMiddleware = (function(config, options) {
  return new ConfigOverrideMiddleware(config, options);
});
var configAliasMiddleware = (function(config, options) {
  return new ConfigAliasMiddleware(config, options);
});
