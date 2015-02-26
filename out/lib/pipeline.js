"use strict";
Object.defineProperties(module.exports, {
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
let combineStreamHandlers = (function(handler1, handler2) {
  return (function(args, streamable) {
    return handler1(copy(args), streamable).then((function(streamable) {
      return handler2(args, streamable);
    }));
  });
});
let streamCombinator = {
  field: 'streamHandler',
  combineHandlers: combineStreamHandlers
};
let defaultCombinators = [streamCombinator];
let combineHandleables = (function(handleable1, handleable2, combinators) {
  let newHandleable = {};
  combinators.forEach((function($__3) {
    var $__4 = $__3,
        field = $__4.field,
        combineHandlers = $__4.combineHandlers;
    let handler1 = handleable1[field];
    let handler2 = handleable2[field];
    if (!handler1 || !handler2)
      return ;
    let newHandler = combineHandlers(handler1, handler2);
    newHandleable[field] = newHandler;
  }));
  return newHandleable;
});
let pipelineHandleables = (function(handleables, combinators) {
  var $__4,
      $__5;
  if (handleables.length == 1)
    return handleables[0];
  let $__3 = handleables,
      handleable1 = ($__4 = $__3[$traceurRuntime.toProperty(Symbol.iterator)](), ($__5 = $__4.next()).done ? void 0 : $__5.value),
      handleable2 = ($__5 = $__4.next()).done ? void 0 : $__5.value,
      restHandleables = $traceurRuntime.iteratorToArray($__4);
  let newHandleable = combineHandleables(handleable1, handleable2, combinators);
  return pipelineHandleables($traceurRuntime.spread([newHandleable], restHandleables), combinators);
});
let pipelineBuilder = (function(builders, combinators) {
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
  let $__3 = options,
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
    let builders = this.pipelineHandlers.map((function(component) {
      return component.toHandleableBuilder();
    }));
    if (builders.length == 0)
      throw new Error('Pipeline must contain at least one handler component');
    let combinators = this._pipelineCombinators;
    return pipelineBuilder(builders, combinators);
  },
  get type() {
    return 'pipeline';
  },
  toJson: function() {
    let json = $traceurRuntime.superGet(this, $Pipeline.prototype, "toJson").call(this);
    json.pipelines = this.pipelineHandlers.map((function(component) {
      return component.toJson();
    }));
    return json;
  }
}, {}, ExtensibleHandler);
let pipeline = (function(options) {
  return new Pipeline(options);
});
