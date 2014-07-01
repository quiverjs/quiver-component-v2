"use strict";
Object.defineProperties(exports, {
  Component: {get: function() {
      return Component;
    }},
  __esModule: {value: true}
});
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
