"use strict";
Object.defineProperties(exports, {
  HandleableMiddleware: {get: function() {
      return HandleableMiddleware;
    }},
  handleableMiddleware: {get: function() {
      return handleableMiddleware;
    }},
  __esModule: {value: true}
});
var assertInstanceOf = $traceurRuntime.assertObject(require('quiver-object')).assertInstanceOf;
var safeHandler = $traceurRuntime.assertObject(require('./util/wrap.js')).safeHandler;
var ExtensibleMiddleware = $traceurRuntime.assertObject(require('./extensible-component.js')).ExtensibleMiddleware;
var $__1 = $traceurRuntime.assertObject(require('./util/middleware.js')),
    combineMiddlewares = $__1.combineMiddlewares,
    repeatOnceMiddleware = $__1.repeatOnceMiddleware;
var HandleableMiddleware = function HandleableMiddleware(handleableMiddleware) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._rawHandleableMiddleware = handleableMiddleware;
  var middleware = safeHandler(handleableMiddleware, options);
  var repeat = $traceurRuntime.assertObject(options).repeat;
  if (repeat == 'once')
    middleware = repeatOnceMiddleware(this.id, middleware);
  this._mainHandleableMiddleware = middleware;
  $traceurRuntime.superCall(this, $HandleableMiddleware.prototype, "constructor", [options]);
};
var $HandleableMiddleware = HandleableMiddleware;
($traceurRuntime.createClass)(HandleableMiddleware, {
  get mainHandleableMiddleware() {
    return this._mainHandleableMiddleware;
  },
  get type() {
    return 'handleable middleware';
  }
}, {}, ExtensibleMiddleware);
var handleableMiddleware = (function(middleware, options) {
  return new HandleableMiddleware(middleware, options);
});
