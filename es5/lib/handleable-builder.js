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
    $__util_47_wrap__,
    $__extensible_45_component__;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var safeHandler = ($__util_47_wrap__ = require("./util/wrap"), $__util_47_wrap__ && $__util_47_wrap__.__esModule && $__util_47_wrap__ || {default: $__util_47_wrap__}).safeHandler;
var ExtensibleHandler = ($__extensible_45_component__ = require("./extensible-component"), $__extensible_45_component__ && $__extensible_45_component__.__esModule && $__extensible_45_component__ || {default: $__extensible_45_component__}).ExtensibleHandler;
var HandleableBuilder = function HandleableBuilder(handleableBuilder) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._mainHandleableBuilder = safeHandler(handleableBuilder, options);
  $traceurRuntime.superConstructor($HandleableBuilder).call(this, options);
};
var $HandleableBuilder = HandleableBuilder;
($traceurRuntime.createClass)(HandleableBuilder, {
  toMainHandleableBuilder: function() {
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
  $traceurRuntime.superConstructor($Handleable).call(this, null, options);
};
var $Handleable = Handleable;
($traceurRuntime.createClass)(Handleable, {
  toMainHandleableBuilder: function() {
    var handleable = this.toHandleable();
    return (function(config) {
      return resolve(handleable);
    });
  },
  toHandleable: function() {
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
