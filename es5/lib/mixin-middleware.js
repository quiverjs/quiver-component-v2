"use strict";
Object.defineProperties(exports, {
  mixinMiddlewareExtensible: {get: function() {
      return mixinMiddlewareExtensible;
    }},
  __esModule: {value: true}
});
var $__component__,
    $__util_47_middleware__;
var MiddlewareComponent = ($__component__ = require("./component"), $__component__ && $__component__.__esModule && $__component__ || {default: $__component__}).MiddlewareComponent;
var combineMiddlewareComponents = ($__util_47_middleware__ = require("./util/middleware"), $__util_47_middleware__ && $__util_47_middleware__.__esModule && $__util_47_middleware__ || {default: $__util_47_middleware__}).combineMiddlewareComponents;
var middlewareMixin = {
  initMiddlewareExtension: function() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    var $__2 = this;
    this._middlewareComponents = [];
    var middlewares = options.middlewares;
    if (middlewares) {
      middlewares.forEach((function(middleware) {
        return $__2.addMiddleware(middleware);
      }));
    }
  },
  addMiddleware: function(middleware) {
    if (!(middleware instanceof MiddlewareComponent))
      throw new TypeError('middleware must be of type MiddlewareComponent');
    this._middlewareComponents.push(middleware);
    return this;
  },
  middleware: function(middleware) {
    return this.addMiddleware(middleware);
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
