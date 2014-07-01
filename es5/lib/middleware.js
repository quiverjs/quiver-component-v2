"use strict";
Object.defineProperties(exports, {
  MiddlewareComponent: {get: function() {
      return MiddlewareComponent;
    }},
  __esModule: {value: true}
});
var Component = $traceurRuntime.assertObject(require('./component.js')).Component;
var MiddlewareComponent = function MiddlewareComponent(options) {
  $traceurRuntime.superCall(this, $MiddlewareComponent.prototype, "constructor", [options]);
};
var $MiddlewareComponent = MiddlewareComponent;
($traceurRuntime.createClass)(MiddlewareComponent, {get handleableMiddleware() {
    throw new Error('unimplemented in abstract class');
  }}, {}, Component);
