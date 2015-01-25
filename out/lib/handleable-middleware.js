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
var $__util_47_wrap__,
    $__extensible_45_component__,
    $__util_47_middleware__;
var safeHandler = ($__util_47_wrap__ = require("./util/wrap"), $__util_47_wrap__ && $__util_47_wrap__.__esModule && $__util_47_wrap__ || {default: $__util_47_wrap__}).safeHandler;
var ExtensibleMiddleware = ($__extensible_45_component__ = require("./extensible-component"), $__extensible_45_component__ && $__extensible_45_component__.__esModule && $__extensible_45_component__ || {default: $__extensible_45_component__}).ExtensibleMiddleware;
var $__2 = ($__util_47_middleware__ = require("./util/middleware"), $__util_47_middleware__ && $__util_47_middleware__.__esModule && $__util_47_middleware__ || {default: $__util_47_middleware__}),
    combineMiddlewares = $__2.combineMiddlewares,
    repeatOnceMiddleware = $__2.repeatOnceMiddleware;
var HandleableMiddleware = function HandleableMiddleware(handleableMiddleware) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._handleableMiddleware = safeHandler(handleableMiddleware, options);
  $traceurRuntime.superConstructor($HandleableMiddleware).call(this, options);
};
var $HandleableMiddleware = HandleableMiddleware;
($traceurRuntime.createClass)(HandleableMiddleware, {
  toMainHandleableMiddleware: function() {
    let middleware = this._handleableMiddleware;
    if (!middleware)
      throw new Error('mainHandleableMiddleware is not defined');
    return middleware;
  },
  get type() {
    return 'Handleable Middleware';
  }
}, {}, ExtensibleMiddleware);
let handleableMiddleware = (function(middleware, options) {
  return new HandleableMiddleware(middleware, options);
});
