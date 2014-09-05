"use strict";
Object.defineProperties(exports, {
  mixinMiddlewareExtensible: {get: function() {
      return mixinMiddlewareExtensible;
    }},
  __esModule: {value: true}
});
var $__component_46_js__,
    $__util_47_middleware_46_js__;
var MiddlewareComponent = ($__component_46_js__ = require("./component.js"), $__component_46_js__ && $__component_46_js__.__esModule && $__component_46_js__ || {default: $__component_46_js__}).MiddlewareComponent;
var combineMiddlewareComponents = ($__util_47_middleware_46_js__ = require("./util/middleware.js"), $__util_47_middleware_46_js__ && $__util_47_middleware_46_js__.__esModule && $__util_47_middleware_46_js__ || {default: $__util_47_middleware_46_js__}).combineMiddlewareComponents;
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
