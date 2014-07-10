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
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var assertInstanceOf = $traceurRuntime.assertObject(require('quiver-object')).assertInstanceOf;
var safeHandler = $traceurRuntime.assertObject(require('./util/wrap.js')).safeHandler;
var ExtensibleHandler = $traceurRuntime.assertObject(require('./extensible-component.js')).ExtensibleHandler;
var privatizedConstructor = $traceurRuntime.assertObject(require('./privatize.js')).privatizedConstructor;
var HandleableBuilder = function HandleableBuilder(handleableBuilder) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._rawHandleableBuilder = handleableBuilder;
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
  var builder = (function(config) {
    return resolve(handleable);
  });
  options.safeWrapped = true;
  $traceurRuntime.superCall(this, $Handleable.prototype, "constructor", [builder, options]);
};
var $Handleable = Handleable;
($traceurRuntime.createClass)(Handleable, {get type() {
    return 'handleable';
  }}, {}, HandleableBuilder);
var handleableBuilder = (function(builder, options) {
  return new HandleableBuilder(builder, options);
});
var handleable = (function(handleable, options) {
  return new Handleable(handleable, options);
});
