"use strict";
Object.defineProperties(exports, {
  HandleableMiddleware: {get: function() {
      return HandleableMiddleware;
    }},
  __esModule: {value: true}
});
var safeHandler = $traceurRuntime.assertObject(require('./util/wrap.js')).safeHandler;
var MiddlewareComponent = $traceurRuntime.assertObject(require('./middleware.js')).MiddlewareComponent;
var mixinMiddlewareExtensible = $traceurRuntime.assertObject(require('./extend-middleware.js')).mixinMiddlewareExtensible;
var HandleableMiddleware = function HandleableMiddleware(handleableMiddleware) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._rawHandleableMiddleware = handleableMiddleware;
  this._handleableMiddleware = safeHandler(handleableMiddleware, options);
  this._initMiddlewareExtension(options);
  $traceurRuntime.superCall(this, $HandleableMiddleware.prototype, "constructor", [options]);
};
var $HandleableMiddleware = HandleableMiddleware;
($traceurRuntime.createClass)(HandleableMiddleware, {
  get rawHandleableMiddleware() {
    return this._rawHandleableMiddleware;
  },
  get handleableMiddleware() {
    var mainMiddleware = this._handleableMiddleware;
    var extendMiddleware = this.extendMiddleware;
    return combineMiddlewares([mainMiddleware, extendMiddleware]);
  }
}, {}, MiddlewareComponent);
mixinMiddlewareExtensible(HandleableMiddleware);
