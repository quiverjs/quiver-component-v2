"use strict";
Object.defineProperties(exports, {
  PipelineHandler: {get: function() {
      return PipelineHandler;
    }},
  __esModule: {value: true}
});
var HandlerComponent = $traceurRuntime.assertObject(require('./handler.js')).HandlerComponent;
var HandleableBuilder = $traceurRuntime.assertObject(require('./handleable-builder.js')).HandleableBuilder;
var createPipeline = $traceurRuntime.assertObject(require('quiver-pipeline')).createPipeline;
var PipelineHandler = function PipelineHandler(handlerComponents, options) {
  this._pipelineHandlers = handlerComponents;
  var builders = handlerComponents.map((function(component) {
    if (!(component instanceof HandlerComponent)) {
      throw new Error('pipeline components must be of type HandlerComponent');
    }
    return component.handleableBuilder;
  }));
  var handleableBuilder = createPipeline(builders);
  $traceurRuntime.superCall(this, $PipelineHandler.prototype, "constructor", [handleableBuilder, options]);
};
var $PipelineHandler = PipelineHandler;
($traceurRuntime.createClass)(PipelineHandler, {}, {}, HandleableBuilder);
