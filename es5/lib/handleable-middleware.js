"use strict";
Object.defineProperties(exports, {
  HandleableMiddleware: {get: function() {
      return HandleableMiddleware;
    }},
  __esModule: {value: true}
});
var assertInstanceOf = $traceurRuntime.assertObject(require('quiver-object')).assertInstanceOf;
var safeHandler = $traceurRuntime.assertObject(require('./util/wrap.js')).safeHandler;
var MiddlewareComponent = $traceurRuntime.assertObject(require('./component.js')).MiddlewareComponent;
var combineMiddlewares = $traceurRuntime.assertObject(require('./util/middleware.js')).combineMiddlewares;
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
  },
  get type() {
    return 'handleable middleware';
  },
  toJson: function() {
    var json = $traceurRuntime.superCall(this, $HandleableMiddleware.prototype, "toJson", []);
    json.middlewares = this.middlewareJson();
    return json;
  }
}, {}, MiddlewareComponent);
mixinMiddlewareExtensible(HandleableMiddleware);
