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
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var StreamFilter = $traceurRuntime.assertObject(require('./filter.js')).StreamFilter;
var HandlerComponent = $traceurRuntime.assertObject(require('./component.js')).HandlerComponent;
var loadStreamHandler = $traceurRuntime.assertObject(require('./util/loader.js')).loadStreamHandler;
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
        $__1 = 1; $__1 < arguments.length; $__1++)
      restArgs[$__1 - 1] = arguments[$__1];
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
  this._transformComponent = handlerComponent;
  if (!validModes[transformMode])
    throw new TypeError('invalid transform mode provided in options');
  this._transformMode = transformMode;
  options.safeWrapped = true;
  $traceurRuntime.superCall(this, $TransformFilter.prototype, "constructor", [null, options]);
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
    return this._transformComponent;
  },
  get transformMode() {
    return this._transformMode;
  },
  privatize: function(privateInstance, privateTable) {
    privateInstance._transformComponent = this._transformComponent.makePrivate(privateTable);
    $traceurRuntime.superCall(this, $TransformFilter.prototype, "privatize", [privateInstance, privateTable]);
  },
  get type() {
    return 'transform filter';
  },
  toJson: function() {
    var json = $traceurRuntime.superCall(this, $TransformFilter.prototype, "toJson", []);
    json.transformMode = this.transformMode;
    json.transformHandler = this.transformComponent.toJson();
    return json;
  }
}, {}, StreamFilter);
var transformFilter = (function(handler, mode, options) {
  return new TransformFilter(handler, mode, options);
});
