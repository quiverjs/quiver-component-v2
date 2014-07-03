"use strict";
Object.defineProperties(exports, {
  Component: {get: function() {
      return Component;
    }},
  MiddlewareComponent: {get: function() {
      return MiddlewareComponent;
    }},
  HandlerComponent: {get: function() {
      return HandlerComponent;
    }},
  __esModule: {value: true}
});
var loadHandleable = $traceurRuntime.assertObject(require('./util/loader.js')).loadHandleable;
var Component = function Component() {
  var $__2;
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  var $__1 = $traceurRuntime.assertObject(options),
      name = ($__2 = $__1.name) === void 0 ? '' : $__2;
  this._name = name;
};
($traceurRuntime.createClass)(Component, {get name() {
    return this._name;
  }}, {});
var MiddlewareComponent = function MiddlewareComponent() {
  $traceurRuntime.defaultSuperCall(this, $MiddlewareComponent.prototype, arguments);
};
var $MiddlewareComponent = MiddlewareComponent;
($traceurRuntime.createClass)(MiddlewareComponent, {get handleableMiddleware() {
    throw new Error('unimplemented in abstract class');
  }}, {}, Component);
var HandlerComponent = function HandlerComponent() {
  $traceurRuntime.defaultSuperCall(this, $HandlerComponent.prototype, arguments);
};
var $HandlerComponent = HandlerComponent;
($traceurRuntime.createClass)(HandlerComponent, {
  get handleableBuilder() {
    throw new Error('unimplemented in abstract class');
  },
  loadHandleable: function(config, options) {
    return loadHandleable(config, this, options);
  },
  loadHandler: function(config, options) {
    return loadHandleable(config, this, options);
  }
}, {}, Component);
