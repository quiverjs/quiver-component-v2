"use strict";
Object.defineProperties(exports, {
  mixinMiddlewareExtensible: {get: function() {
      return mixinMiddlewareExtensible;
    }},
  __esModule: {value: true}
});
var MiddlewareComponent = $traceurRuntime.assertObject(require('./component.js')).MiddlewareComponent;
var combineMiddlewareComponents = $traceurRuntime.assertObject(require('./util/middleware.js')).combineMiddlewareComponents;
var mixinMiddlewareExtensible = (function(Class) {
  var proto = Class.prototype;
  proto._initMiddlewareExtension = function() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    var $__0 = this;
    this._middlewareComponents = [];
    var middlewares = $traceurRuntime.assertObject(options).middlewares;
    if (middlewares) {
      middlewares.forEach((function(middleware) {
        return $__0.addMiddleware(middleware);
      }));
    }
  };
  proto.addMiddleware = function(middleware) {
    if (!(middleware instanceof MiddlewareComponent))
      throw new TypeError('middleware must be of type MiddlewareComponent');
    this._middlewareComponents.push(middleware);
    return this;
  };
  Object.defineProperty(proto, 'middlewareComponents', {get: function() {
      return this._middlewareComponents.slice();
    }});
  Object.defineProperty(proto, 'extendMiddleware', {get: function() {
      return combineMiddlewareComponents(this._middlewareComponents);
    }});
});
