"use strict";
Object.defineProperties(exports, {
  mixinMiddlewareExtensible: {get: function() {
      return mixinMiddlewareExtensible;
    }},
  __esModule: {value: true}
});
var MiddlewareComponent = $traceurRuntime.assertObject(require('./component.js')).MiddlewareComponent;
var combineMiddlewareComponents = $traceurRuntime.assertObject(require('./util/middleware.js')).combineMiddlewareComponents;
var middlewareMixin = {
  initMiddlewareExtension: function() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    var $__0 = this;
    this._middlewareComponents = [];
    var middlewares = $traceurRuntime.assertObject(options).middlewares;
    if (middlewares) {
      middlewares.forEach((function(middleware) {
        return $__0.addMiddleware(middleware);
      }));
    }
  },
  addMiddleware: function(middleware) {
    if (!(middleware instanceof MiddlewareComponent))
      throw new TypeError('middleware must be of type MiddlewareComponent');
    this._middlewareComponents.push(middleware);
    return this;
  },
  middlewareJson: function() {
    var middlewares = this.middlewareComponents;
    if (middlewares.length == 0)
      return undefined;
    return middlewares.map((function(component) {
      return component.toJson();
    }));
  },
  privatizeMiddlewares: function(privateInstance, privateTable) {
    privateInstance._middlewareComponents = this._middlewareComponents.map((function(component) {
      return component.makePrivate(privateTable);
    }));
  }
};
var mixinMiddlewareExtensible = (function(prototype) {
  Object.assign(prototype, middlewareMixin);
  Object.defineProperty(prototype, 'middlewareComponents', {get: function() {
      return this._middlewareComponents.slice();
    }});
  Object.defineProperty(prototype, 'extendMiddleware', {get: function() {
      return combineMiddlewareComponents(this._middlewareComponents);
    }});
});
