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
var safeHandler = $traceurRuntime.assertObject(require('./util/wrap.js')).safeHandler;
var ExtensibleMiddleware = $traceurRuntime.assertObject(require('./extensible-component.js')).ExtensibleMiddleware;
var $__1 = $traceurRuntime.assertObject(require('./util/middleware.js')),
    combineMiddlewares = $__1.combineMiddlewares,
    repeatOnceMiddleware = $__1.repeatOnceMiddleware;
var HandleableMiddleware = function HandleableMiddleware(handleableMiddleware) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._mainMiddleware = safeHandler(handleableMiddleware, options);
  this._repeat = options.repeat;
  $traceurRuntime.superCall(this, $HandleableMiddleware.prototype, "constructor", [options]);
};
var $HandleableMiddleware = HandleableMiddleware;
($traceurRuntime.createClass)(HandleableMiddleware, {
  get mainHandleableMiddleware() {
    var middleware = this.mainMiddleware;
    if (this._repeat == 'once')
      middleware = repeatOnceMiddleware(this.id, middleware);
    return middleware;
  },
  get mainMiddleware() {
    var middleware = this._mainHandleableMiddleware;
    if (!middleware)
      throw new Error('mainHandleableMiddleware is not defined');
    return middleware;
  },
  get type() {
    return 'Handleable Middleware';
  }
}, {}, ExtensibleMiddleware);
var handleableMiddleware = (function(middleware, options) {
  return new HandleableMiddleware(middleware, options);
});
