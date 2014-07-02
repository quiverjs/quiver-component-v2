"use strict";
Object.defineProperties(exports, {
  MiddlewareComponent: {get: function() {
      return MiddlewareComponent;
    }},
  __esModule: {value: true}
});
var Component = $traceurRuntime.assertObject(require('./component.js')).Component;
var MiddlewareComponent = function MiddlewareComponent() {
  $traceurRuntime.defaultSuperCall(this, $MiddlewareComponent.prototype, arguments);
};
var $MiddlewareComponent = MiddlewareComponent;
($traceurRuntime.createClass)(MiddlewareComponent, {get handleableMiddleware() {
    throw new Error('unimplemented in abstract class');
  }}, {}, Component);
