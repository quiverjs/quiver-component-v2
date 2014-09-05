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
var $__util_47_wrap_46_js__,
    $__extensible_45_component_46_js__,
    $__util_47_middleware_46_js__;
var safeHandler = ($__util_47_wrap_46_js__ = require("./util/wrap.js"), $__util_47_wrap_46_js__ && $__util_47_wrap_46_js__.__esModule && $__util_47_wrap_46_js__ || {default: $__util_47_wrap_46_js__}).safeHandler;
var ExtensibleMiddleware = ($__extensible_45_component_46_js__ = require("./extensible-component.js"), $__extensible_45_component_46_js__ && $__extensible_45_component_46_js__.__esModule && $__extensible_45_component_46_js__ || {default: $__extensible_45_component_46_js__}).ExtensibleMiddleware;
var $__2 = ($__util_47_middleware_46_js__ = require("./util/middleware.js"), $__util_47_middleware_46_js__ && $__util_47_middleware_46_js__.__esModule && $__util_47_middleware_46_js__ || {default: $__util_47_middleware_46_js__}),
    combineMiddlewares = $__2.combineMiddlewares,
    repeatOnceMiddleware = $__2.repeatOnceMiddleware;
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
