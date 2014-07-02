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
var safeHandler = $traceurRuntime.assertObject(require('./util/wrap.js')).safeHandler;
var HandlerComponent = $traceurRuntime.assertObject(require('./component.js')).HandlerComponent;
var mixinMiddlewareExtensible = $traceurRuntime.assertObject(require('./extend-middleware.js')).mixinMiddlewareExtensible;
var combineBuilderWithMiddleware = $traceurRuntime.assertObject(require('./util/middleware.js')).combineBuilderWithMiddleware;
var HandleableBuilder = function HandleableBuilder(handleableBuilder) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._rawHandleableBuilder = handleableBuilder;
  this._handleableBuilder = safeHandler(handleableBuilder, options);
  this._initMiddlewareExtension(options);
  $traceurRuntime.superCall(this, $HandleableBuilder.prototype, "constructor", [options]);
};
var $HandleableBuilder = HandleableBuilder;
($traceurRuntime.createClass)(HandleableBuilder, {
  get rawHandleableBuilder() {
    return this._rawHandleableBuilder;
  },
  get handleableBuilder() {
    var builder = this._handleableBuilder;
    var middleware = this.extendMiddleware;
    return combineBuilderWithMiddleware(builder, middleware);
  }
}, {}, HandlerComponent);
mixinMiddlewareExtensible(HandleableBuilder);
var Handleable = function Handleable(handleable) {
  var option = arguments[1] !== (void 0) ? arguments[1] : {};
  var builder = (function(config) {
    return resolve(handleable);
  });
  options.safeWrapped = true;
  $traceurRuntime.superCall(this, $Handleable.prototype, "constructor", [builder, options]);
};
var $Handleable = Handleable;
($traceurRuntime.createClass)(Handleable, {}, {}, HandleableBuilder);
