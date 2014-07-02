"use strict";
Object.defineProperties(exports, {
  ConfigMiddleware: {get: function() {
      return ConfigMiddleware;
    }},
  __esModule: {value: true}
});
var HandleableMiddleware = $traceurRuntime.assertObject(require('./handleable-middleware.js')).HandleableMiddleware;
var safePromised = $traceurRuntime.assertObject(require('quiver-promise')).safePromised;
var ConfigMiddleware = function ConfigMiddleware(configHandler, options) {
  this._configHandler = configHandler;
  configHandler = safePromised(configHandler);
  var middleware = (function(config, builder) {
    return configHandler(config).then(builder);
  });
  $traceurRuntime.superCall(this, $ConfigMiddleware.prototype, "constructor", [middleware, options]);
};
var $ConfigMiddleware = ConfigMiddleware;
($traceurRuntime.createClass)(ConfigMiddleware, {}, {}, HandleableMiddleware);
