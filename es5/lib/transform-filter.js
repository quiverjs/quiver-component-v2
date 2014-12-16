"use strict";
Object.defineProperties(exports, {
  TransformFilter: {get: function() {
      return TransformFilter;
    }},
  transformFilter: {get: function() {
      return transformFilter;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__,
    $__quiver_45_object__,
    $__filter__,
    $__component__,
    $__util_47_loader__;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var StreamFilter = ($__filter__ = require("./filter"), $__filter__ && $__filter__.__esModule && $__filter__ || {default: $__filter__}).StreamFilter;
var HandlerComponent = ($__component__ = require("./component"), $__component__ && $__component__.__esModule && $__component__ || {default: $__component__}).HandlerComponent;
var loadStreamHandler = ($__util_47_loader__ = require("./util/loader"), $__util_47_loader__ && $__util_47_loader__.__esModule && $__util_47_loader__ || {default: $__util_47_loader__}).loadStreamHandler;
var validModes = {
  'in': true,
  'out': true,
  'inout': true
};
var echoHandler = (function(args, streamable) {
  return resolve(streamable);
});
var wrapHandler = (function(handler) {
  return (function(args) {
    for (var restArgs = [],
        $__6 = 1; $__6 < arguments.length; $__6++)
      restArgs[$__6 - 1] = arguments[$__6];
    return handler.apply(null, $traceurRuntime.spread([copy(args)], restArgs));
  });
});
var inTransformHandler = (function(handler, mode) {
  return mode != 'out' ? wrapHandler(handler) : echoHandler;
});
var wrapMainHandler = (function(handler, mode) {
  return mode == 'in' ? handler : wrapHandler(handler);
});
var outTransformHandler = (function(handler, mode) {
  return mode != 'in' ? handler : echoHandler;
});
var TransformFilter = function TransformFilter(handlerComponent, transformMode) {
  var options = arguments[2] !== (void 0) ? arguments[2] : {};
  if (!(handlerComponent instanceof HandlerComponent))
    throw new TypeError('input handler component must be of type HandlerComponent');
  if (!validModes[transformMode])
    throw new TypeError('invalid transform mode provided in options');
  this._transformMode = transformMode;
  options.safeWrapped = true;
  $traceurRuntime.superConstructor($TransformFilter).call(this, null, options);
  this.subComponents.transformComponent = handlerComponent;
};
var $TransformFilter = TransformFilter;
($traceurRuntime.createClass)(TransformFilter, {
  get streamFilter() {
    var transformComponent = this.transformComponent;
    var transformMode = this.transformMode;
    return (function(config, handler) {
      return loadStreamHandler(config, transformComponent).then((function(transformHandler) {
        var transformIn = inTransformHandler(transformHandler, transformMode);
        var mainHandler = wrapMainHandler(handler, transformMode);
        var transformOut = outTransformHandler(transformHandler, transformMode);
        return (function(args, streamable) {
          return transformIn(args, streamable).then((function(transformedIn) {
            return mainHandler(args, transformedIn).then((function(resultStreamable) {
              return transformOut(args, resultStreamable);
            }));
          }));
        });
      }));
    });
  },
  get transformComponent() {
    return this.subComponents.transformComponent;
  },
  get transformMode() {
    return this._transformMode;
  },
  get type() {
    return 'transform filter';
  },
  toJson: function() {
    var json = $traceurRuntime.superGet(this, $TransformFilter.prototype, "toJson").call(this);
    json.transformMode = this.transformMode;
    json.transformHandler = this.transformComponent.toJson();
    return json;
  }
}, {}, StreamFilter);
var transformFilter = (function(handler, mode, options) {
  return new TransformFilter(handler, mode, options);
});
