"use strict";
Object.defineProperties(exports, {
  AbstractHandler: {get: function() {
      return AbstractHandler;
    }},
  AbstractMiddleware: {get: function() {
      return AbstractMiddleware;
    }},
  abstractHandler: {get: function() {
      return abstractHandler;
    }},
  abstractMiddleware: {get: function() {
      return abstractMiddleware;
    }},
  __esModule: {value: true}
});
var $__extensible_45_component__;
var $__0 = ($__extensible_45_component__ = require("./extensible-component"), $__extensible_45_component__ && $__extensible_45_component__.__esModule && $__extensible_45_component__ || {default: $__extensible_45_component__}),
    ExtensibleHandler = $__0.ExtensibleHandler,
    ExtensibleMiddleware = $__0.ExtensibleMiddleware;
var defineAbstractComponent = (function(Parent, mixin) {
  var AbstractComponent = function AbstractComponent(componentKey) {
    this._componentKey = componentKey;
  };
  var $AbstractComponent = AbstractComponent;
  ($traceurRuntime.createClass)(AbstractComponent, {
    each: function(iteratee) {
      if (this._concreteComponent) {
        iteratee(this._concreteComponent);
      }
      $traceurRuntime.superGet(this, $AbstractComponent.prototype, "each").call(this, iteratee);
    },
    doMap: function(target, mapper) {
      if (this._concreteComponent) {
        target._concreteComponent = mapper(this._concreteComponent);
      }
      $traceurRuntime.superGet(this, $AbstractComponent.prototype, "doMap").call(this, target, mapper);
    },
    implement: function(componentMap) {
      if (!this._concreteComponent) {
        var componentKey = this._componentKey;
        var concreteComponent = componentMap[componentKey];
        if (concreteComponent) {
          this.validateConcreteComponent(concreteComponent);
          this._concreteComponent = concreteComponent;
        }
      }
      $traceurRuntime.superGet(this, $AbstractComponent.prototype, "implement").call(this, componentMap);
    }
  }, {}, Parent);
  Object.assign(AbstractComponent.prototype, mixin);
  return AbstractComponent;
});
var AbstractHandler = defineAbstractComponent(ExtensibleHandler, {
  toMainHandleableBuilder: function() {
    var concreteComponent = this._concreteComponent;
    if (!concreteComponent) {
      throw new Error('Abstract handler component ' + 'not implemented: ' + this._componentKey);
    }
    return concreteComponent.toHandleableBuilder();
  },
  validateConcreteComponent: function(component) {
    if (!concreteComponent.isHandlerComponent()) {
      throw new Error('Concrete component in ' + 'implementation map is not handler component: ' + componentKey);
    }
  }
});
var AbstractMiddleware = defineAbstractComponent(ExtensibleMiddleware, {
  toMainHandleableMiddleware: function() {
    var concreteComponent = this._concreteComponent;
    if (!concreteComponent)
      throw new Error('Abstract middleware component ' + 'not implemented: ' + this._componentKey);
    return concreteComponent.toMainHandleableMiddleware();
  },
  validateConcreteComponent: function(component) {
    if (!concreteComponent.isMiddlewareComponent()) {
      throw new Error('Concrete component in ' + 'implementation map is not middleware component: ' + componentKey);
    }
  }
});
var abstractHandler = (function(componentKey) {
  return new AbstractHandler(componentKey);
});
var abstractMiddleware = (function(componentKey) {
  return new AbstractMiddleware(componentKey);
});
