"use strict";
Object.defineProperties(exports, {
  Pipeline: {get: function() {
      return Pipeline;
    }},
  pipeline: {get: function() {
      return pipeline;
    }},
  __esModule: {value: true}
});
var $__1 = $traceurRuntime.assertObject(require('quiver-object')),
    copy = $__1.copy,
    defineGetter = $__1.defineGetter,
    assertInstanceOf = $__1.assertInstanceOf,
    assertArrayInstanceOf = $__1.assertArrayInstanceOf;
var HandlerComponent = $traceurRuntime.assertObject(require('./component.js')).HandlerComponent;
var ExtensibleHandler = $traceurRuntime.assertObject(require('./extensible-component.js')).ExtensibleHandler;
var combineStreamHandlers = (function(handler1, handler2) {
  return (function(args, streamable) {
    return handler1(copy(args), streamable).then((function(streamable) {
      return handler2(args, streamable);
    }));
  });
});
var streamCombinator = {
  field: 'streamHandler',
  combineHandlers: combineStreamHandlers
};
var defaultCombinators = [streamCombinator];
var combineHandleables = (function(handleable1, handleable2, combinators) {
  var newHandleable = {};
  combinators.forEach((function($__1) {
    var field = $__1.field,
        combineHandlers = $__1.combineHandlers;
    var handler1 = handleable1[field];
    var handler2 = handleable2[field];
    if (!handler1 || !handler2)
      return;
    var newHandler = combineHandlers(handler1, handler2);
    defineGetter(newHandleable, field, newHandler);
  }));
  return newHandleable;
});
var pipelineHandleables = (function(handleables, combinators) {
  if (handleables.length == 1)
    return handleables[0];
  var $__1 = $traceurRuntime.assertObject(handleables),
      handleable1 = $__1[0],
      handleable2 = $__1[1],
      restHandleables = Array.prototype.slice.call($__1, 2);
  var newHandleable = combineHandleables(handleable1, handleable2, combinators);
  return pipelineHandleables($traceurRuntime.spread([newHandleable], restHandleables), combinators);
});
var pipelineBuilder = (function(builders, combinators) {
  return (function(config) {
    return Promise.all(builders.map((function(builder) {
      return builder(copy(config));
    }))).then((function(handleables) {
      return pipelineHandleables(handleables, combinators);
    }));
  });
});
var Pipeline = function Pipeline() {
  var $__2;
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  var $__1 = $traceurRuntime.assertObject(options),
      pipelineCombinators = ($__2 = $__1.pipelineCombinators) === void 0 ? defaultCombinators : $__2;
  this._pipelineHandlers = [];
  this._pipelineCombinators = pipelineCombinators;
  $traceurRuntime.superCall(this, $Pipeline.prototype, "constructor", [options]);
};
var $Pipeline = Pipeline;
($traceurRuntime.createClass)(Pipeline, {
  addPipe: function(component) {
    assertInstanceOf(component, HandlerComponent, 'component must be of type HandlerComponent');
    this._pipelineHandlers.push(component);
    return this;
  },
  get pipelineHandlers() {
    return this._pipelineHandlers.slice();
  },
  get mainHandleableBuilder() {
    var builders = this._pipelineHandlers.map((function(component) {
      return component.handleableBuilder;
    }));
    var combinators = this._pipelineCombinators;
    if (builders.length == 0)
      throw new Error('Pipeline must contain at least one handler component');
    return pipelineBuilder(builders, combinators);
  },
  get type() {
    return 'pipeline';
  },
  toJson: function() {
    var json = $traceurRuntime.superCall(this, $Pipeline.prototype, "toJson", []);
    json.pipelines = this.pipelineHandlers.map((function(component) {
      return component.toJson();
    }));
    return json;
  }
}, {}, ExtensibleHandler);
var pipeline = (function(options) {
  return new Pipeline(options);
});
