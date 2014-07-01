"use strict";
Object.defineProperties(exports, {
  HandlerComponent: {get: function() {
      return HandlerComponent;
    }},
  __esModule: {value: true}
});
var Component = $traceurRuntime.assertObject(require('./component.js')).Component;
var HandlerComponent = function HandlerComponent() {
  $traceurRuntime.defaultSuperCall(this, $HandlerComponent.prototype, arguments);
};
var $HandlerComponent = HandlerComponent;
($traceurRuntime.createClass)(HandlerComponent, {
  get handleableBuilder() {
    throw new Error('unimplemented in abstract class');
  },
  loadHandleable: function(config, options) {
    throw new Error('unimplemented in abstract class');
  },
  loadHandler: function(config, options) {
    throw new Error('unimplemented in abstract class');
  }
}, {}, Component);
