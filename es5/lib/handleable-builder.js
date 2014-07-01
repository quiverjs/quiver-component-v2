"use strict";
Object.defineProperties(exports, {
  HandleableBuilder: {get: function() {
      return HandleableBuilder;
    }},
  Handleable: {get: function() {
      return Handleable;
    }},
  __esModule: {value: true}
});
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var loadHandleable = $traceurRuntime.assertObject(require('./util/loader.js')).loadHandleable;
var HandlerComponent = $traceurRuntime.assertObject(require('./handler.js')).HandlerComponent;
var mixinMiddlewareExtensible = $traceurRuntime.assertObject(require('./extend-middleware.js')).mixinMiddlewareExtensible;
var combineBuilderWithMiddleware = $traceurRuntime.assertObject(require('./util/middleware.js')).combineBuilderWithMiddleware;
var HandleableBuilder = function HandleableBuilder(handleableBuilder, options) {
  if (typeof(handleableBuilder) != 'function') {
    throw new Error('handleable builder must be of type function');
  }
  this._handleableBuilder = handleableBuilder;
  this._initMiddlewareExtension(options);
  $traceurRuntime.superCall(this, $HandleableBuilder.prototype, "constructor", [options]);
};
var $HandleableBuilder = HandleableBuilder;
($traceurRuntime.createClass)(HandleableBuilder, {
  get rawHandleableBuilder() {
    return this._handleableBuilder;
  },
  get handleableBuilder() {
    var builder = this._handleableBuilder;
    var middleware = this.extendMiddleware;
    return combineBuilderWithMiddleware(builder, middleware);
  },
  loadHandleable: function(config, options) {
    return loadHandleable(config, this, this.handleableBuilder, options);
  },
  loadHandler: function(config, options) {
    return loadHandleable(config, options);
  }
}, {}, HandlerComponent);
mixinMiddlewareExtensible(HandleableBuilder);
var Handleable = function Handleable(handleable, options) {
  var builder = (function(config) {
    return resolve(handleable);
  });
  $traceurRuntime.superCall(this, $Handleable.prototype, "constructor", [builder, options]);
};
var $Handleable = Handleable;
($traceurRuntime.createClass)(Handleable, {}, {}, HandleableBuilder);
