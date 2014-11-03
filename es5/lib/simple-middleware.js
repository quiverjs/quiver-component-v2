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
var $__quiver_45_object__,
    $__quiver_45_promise__,
    $__handleable_45_middleware_46_js__,
    $__util_47_wrap_46_js__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var HandleableMiddleware = ($__handleable_45_middleware_46_js__ = require("./handleable-middleware.js"), $__handleable_45_middleware_46_js__ && $__handleable_45_middleware_46_js__.__esModule && $__handleable_45_middleware_46_js__ || {default: $__handleable_45_middleware_46_js__}).HandleableMiddleware;
var safeHandler = ($__util_47_wrap_46_js__ = require("./util/wrap.js"), $__util_47_wrap_46_js__ && $__util_47_wrap_46_js__.__esModule && $__util_47_wrap_46_js__ || {default: $__util_47_wrap_46_js__}).safeHandler;
var configHandlerToMiddleware = (function(configHandler) {
  return (function(config, builder) {
    return configHandler(config).then((function() {
      var newConfig = arguments[0] !== (void 0) ? arguments[0] : config;
      return builder(newConfig);
    }));
  });
});
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
