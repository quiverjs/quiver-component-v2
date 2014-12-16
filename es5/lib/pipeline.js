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
var $__quiver_45_object__,
    $__component__,
    $__extensible_45_component__;
var $__0 = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}),
    copy = $__0.copy,
    defineGetter = $__0.defineGetter,
    assertInstanceOf = $__0.assertInstanceOf,
    assertArrayInstanceOf = $__0.assertArrayInstanceOf;
var HandlerComponent = ($__component__ = require("./component"), $__component__ && $__component__.__esModule && $__component__ || {default: $__component__}).HandlerComponent;
var ExtensibleHandler = ($__extensible_45_component__ = require("./extensible-component"), $__extensible_45_component__ && $__extensible_45_component__.__esModule && $__extensible_45_component__ || {default: $__extensible_45_component__}).ExtensibleHandler;
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
  combinators.forEach((function($__4) {
    var $__5 = $__4,
        field = $__5.field,
        combineHandlers = $__5.combineHandlers;
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
  var $__4 = handleables,
      handleable1 = $__4[0],
      handleable2 = $__4[1],
      restHandleables = Array.prototype.slice.call($__4, 2);
  var newHandleable = combineHandleables(handleable1, handleable2, combinators);
  return pipelineHandleables($traceurRuntime.spread([newHandleable], restHandleables), combinators);
});
var pipelineBuilder = (function(builders, combinators) {
  return (function(config) {
    return Promise.all(builders.map((function(builder) {
      return builder(config);
    }))).then((function(handleables) {
      return pipelineHandleables(handleables, combinators);
    }));
  });
});
var Pipeline = function Pipeline() {
  var $__5;
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  var $__4 = options,
      pipelineCombinators = ($__5 = $__4.pipelineCombinators) === void 0 ? defaultCombinators : $__5;
  this._pipelineCombinators = pipelineCombinators;
  $traceurRuntime.superConstructor($Pipeline).call(this, options);
  this.subComponents.pipelineHandlers = [];
};
var $Pipeline = Pipeline;
($traceurRuntime.createClass)(Pipeline, {
  addPipe: function(component) {
    assertInstanceOf(component, HandlerComponent, 'component must be of type HandlerComponent');
    this.subComponents.pipelineHandlers.push(component);
    return this;
  },
  get pipelineHandlers() {
    return this.subComponents.pipelineHandlers;
  },
  get mainHandleableBuilder() {
    var builders = this.pipelineHandlers.map((function(component) {
      return component.handleableBuilder;
    }));
    if (builders.length == 0)
      throw new Error('Pipeline must contain at least one handler component');
    var combinators = this._pipelineCombinators;
    return pipelineBuilder(builders, combinators);
  },
  get type() {
    return 'pipeline';
  },
  toJson: function() {
    var json = $traceurRuntime.superGet(this, $Pipeline.prototype, "toJson").call(this);
    json.pipelines = this.pipelineHandlers.map((function(component) {
      return component.toJson();
    }));
    return json;
  }
}, {}, ExtensibleHandler);
var pipeline = (function(options) {
  return new Pipeline(options);
});
