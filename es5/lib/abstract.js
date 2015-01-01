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
    var options = arguments[1] !== (void 0) ? arguments[1] : {};
    this._componentKey = componentKey;
    $traceurRuntime.superConstructor($AbstractComponent).call(this, options);
  };
  var $AbstractComponent = AbstractComponent;
  ($traceurRuntime.createClass)(AbstractComponent, {
    implement: function(componentMap) {
      if (!this.concreteComponent) {
        var componentKey = this._componentKey;
        var concreteComponent = componentMap[componentKey];
        if (concreteComponent) {
          this.validateConcreteComponent(concreteComponent);
          this.subComponents.concreteComponent = concreteComponent;
        }
      }
      return $traceurRuntime.superGet(this, $AbstractComponent.prototype, "implement").call(this, componentMap);
    },
    get concreteComponent() {
      return this.subComponents.concreteComponent;
    }
  }, {}, Parent);
  Object.assign(AbstractComponent.prototype, mixin);
  return AbstractComponent;
});
var AbstractHandler = defineAbstractComponent(ExtensibleHandler, {
  toMainHandleableBuilder: function() {
    var concreteComponent = (this).concreteComponent;
    if (!concreteComponent) {
      throw new Error('Abstract handler component ' + 'not implemented: ' + this._componentKey);
    }
    return concreteComponent.toHandleableBuilder();
  },
  validateConcreteComponent: function(component) {
    if (!component.isHandlerComponent) {
      throw new Error('Concrete component in ' + 'implementation map is not handler component: ' + componentKey);
    }
  }
});
var AbstractMiddleware = defineAbstractComponent(ExtensibleMiddleware, {
  toMainHandleableMiddleware: function() {
    var concreteComponent = (this).concreteComponent;
    if (!concreteComponent)
      throw new Error('Abstract middleware component ' + 'not implemented: ' + this._componentKey);
    return concreteComponent.toMainHandleableMiddleware();
  },
  validateConcreteComponent: function(component) {
    if (!component.isMiddlewareComponent) {
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
