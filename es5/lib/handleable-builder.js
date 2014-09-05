"use strict";
Object.defineProperties(exports, {
  HandleableBuilder: {get: function() {
      return HandleableBuilder;
    }},
  Handleable: {get: function() {
      return Handleable;
    }},
  handleableBuilder: {get: function() {
      return handleableBuilder;
    }},
  handleable: {get: function() {
      return handleable;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__,
    $__quiver_45_object__,
    $__util_47_wrap_46_js__,
    $__extensible_45_component_46_js__;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var assertInstanceOf = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).assertInstanceOf;
var safeHandler = ($__util_47_wrap_46_js__ = require("./util/wrap.js"), $__util_47_wrap_46_js__ && $__util_47_wrap_46_js__.__esModule && $__util_47_wrap_46_js__ || {default: $__util_47_wrap_46_js__}).safeHandler;
var ExtensibleHandler = ($__extensible_45_component_46_js__ = require("./extensible-component.js"), $__extensible_45_component_46_js__ && $__extensible_45_component_46_js__.__esModule && $__extensible_45_component_46_js__ || {default: $__extensible_45_component_46_js__}).ExtensibleHandler;
var HandleableBuilder = function HandleableBuilder(handleableBuilder) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._mainHandleableBuilder = safeHandler(handleableBuilder, options);
  $traceurRuntime.superCall(this, $HandleableBuilder.prototype, "constructor", [options]);
};
var $HandleableBuilder = HandleableBuilder;
($traceurRuntime.createClass)(HandleableBuilder, {
  get mainHandleableBuilder() {
    return this._mainHandleableBuilder;
  },
  get type() {
    return 'handleable builder';
  }
}, {}, ExtensibleHandler);
var Handleable = function Handleable(handleable) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._handleable = handleable;
  options.safeWrapped = true;
  $traceurRuntime.superCall(this, $Handleable.prototype, "constructor", [null, options]);
};
var $Handleable = Handleable;
($traceurRuntime.createClass)(Handleable, {
  get mainHandleableBuilder() {
    var handleable = this.handleable;
    return (function(config) {
      return resolve(handleable);
    });
  },
  get handleable() {
    if (!this._handleable)
      throw new Error('handleable is not defined');
    return this._handleable;
  },
  get type() {
    return 'handleable';
  }
}, {}, HandleableBuilder);
var handleableBuilder = (function(builder, options) {
  return new HandleableBuilder(builder, options);
});
var handleable = (function(handleable, options) {
  return new Handleable(handleable, options);
});
