"use strict";
Object.defineProperties(exports, {
  mixinMiddlewareExtensible: {get: function() {
      return mixinMiddlewareExtensible;
    }},
  __esModule: {value: true}
});
var MiddlewareComponent = $traceurRuntime.assertObject(require('./component.js')).MiddlewareComponent;
var combineMiddlewareComponents = $traceurRuntime.assertObject(require('./util/middleware.js')).combineMiddlewareComponents;
var mixinMiddlewareExtensible = (function(prototype) {
  prototype._initMiddlewareExtension = function() {
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
  prototype.addMiddleware = function(middleware) {
    if (!(middleware instanceof MiddlewareComponent))
      throw new TypeError('middleware must be of type MiddlewareComponent');
    this._middlewareComponents.push(middleware);
    return this;
  };
  prototype.middlewareJson = function() {
    var middlewares = this.middlewareComponents;
    if (middlewares.length == 0)
      return undefined;
    return middlewares.map((function(component) {
      return component.toJson();
    }));
  };
  prototype.privatizeMiddlewares = function(copy) {
    copy._middlewareComponents = this._middlewareComponents.map((function(component) {
      return component.fork();
    }));
  };
  Object.defineProperty(prototype, 'middlewareComponents', {get: function() {
      return this._middlewareComponents.slice();
    }});
  Object.defineProperty(prototype, 'extendMiddleware', {get: function() {
      return combineMiddlewareComponents(this._middlewareComponents);
    }});
});
