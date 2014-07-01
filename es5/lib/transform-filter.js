"use strict";
Object.defineProperties(exports, {
  TransformFilter: {get: function() {
      return TransformFilter;
    }},
  __esModule: {value: true}
});
var StreamFilter = $traceurRuntime.assertObject(require('./filter.js')).StreamFilter;
var HandlerComponent = $traceurRuntime.assertObject(require('./handler.js')).HandlerComponent;
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var $__1 = $traceurRuntime.assertObject(require('quiver-object')),
    copy = $__1.copy,
    assertDefined = $__1.assertDefined;
var validModes = ['in', 'out', 'inout'];
var streamHandlerLoader = (function(handlerComponent, loadOptions) {
  if (handlerComponent.loadStreamHandler)
    return (function(config) {
      return handlerComponent.loadStreamHandler(config, loadOptions);
    });
  return (function(config) {
    return handlerComponent.loadHandleable(config, loadOptions).then((function(handleable) {
      return assertDefined(handleable.streamHandler);
    }));
  });
});
var echoHandler = (function(args, streamable) {
  return resolve(streamable);
});
var inTransformHandler = (function(handler, mode) {
  return mode == 'out' ? echoHandler : handler;
});
var outTransformHandler = (function(handler, mode) {
  return mode == 'in' ? echoHandler : ahandler;
});
var TransformFilter = function TransformFilter(handlerComponent) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  if (!(handlerComponent instanceof HandlerComponent)) {
    throw new TypeError('input handler component must be of type HandlerComponent');
  }
  var transformMode = $traceurRuntime.assertObject(options).transformMode;
  if (validModes.indexOf(transformMode) == -1) {
    throw new TypeError('invalid transform mode provided in options');
  }
  var loadOptions = $traceurRuntime.assertObject(options).loadOptions;
  var loadStreamHandler = streamHandlerLoader(handlerComponent, loadOptions);
  var streamFilter = (function(config, handler) {
    return loadStreamHandler(config).then((function(transformHandler) {
      var transformIn = inTransformHandler(transformHandler, transformMode);
      var transformOut = outTransformHandler(transformHandler, transformMode);
      return (function(args, streamable) {
        return transformIn(copy(args), streamable).then((function(transformedIn) {
          return handler(copy(args), transformedIn).then((function(resultStreamable) {
            return transformOut(args, resultStreamable);
          }));
        }));
      });
    }));
  });
  $traceurRuntime.superCall(this, $TransformFilter.prototype, "constructor", [streamFilter, options]);
};
var $TransformFilter = TransformFilter;
($traceurRuntime.createClass)(TransformFilter, {}, {}, StreamFilter);
