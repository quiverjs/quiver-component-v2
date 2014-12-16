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
    $__extensible_45_component__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
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
  combinators.forEach((function($__3) {
    var $__4 = $__3,
        field = $__4.field,
        combineHandlers = $__4.combineHandlers;
    var handler1 = handleable1[field];
    var handler2 = handleable2[field];
    if (!handler1 || !handler2)
      return;
    var newHandler = combineHandlers(handler1, handler2);
    newHandleable[field] = newHandler;
  }));
  return newHandleable;
});
var pipelineHandleables = (function(handleables, combinators) {
  if (handleables.length == 1)
    return handleables[0];
  var $__3 = handleables,
      handleable1 = $__3[0],
      handleable2 = $__3[1],
      restHandleables = Array.prototype.slice.call($__3, 2);
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
  var $__4;
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  var $__3 = options,
      pipelineCombinators = ($__4 = $__3.pipelineCombinators) === void 0 ? defaultCombinators : $__4;
  this._pipelineCombinators = pipelineCombinators;
  $traceurRuntime.superConstructor($Pipeline).call(this, options);
  this.subComponents.pipelineHandlers = [];
};
var $Pipeline = Pipeline;
($traceurRuntime.createClass)(Pipeline, {
  addPipe: function(component) {
    if (!component.isHandlerComponent) {
      throw new TypeError('component must be of type HandlerComponent');
    }
    this.subComponents.pipelineHandlers.push(component);
    return this;
  },
  pipe: function(component) {
    return this.addPipe(component);
  },
  get pipelineHandlers() {
    return this.subComponents.pipelineHandlers;
  },
  toMainHandleableBuilder: function() {
    var builders = this.pipelineHandlers.map((function(component) {
      return component.toHandleableBuilder();
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
