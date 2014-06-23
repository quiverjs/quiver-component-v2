import { HandlerComponent } from './handler.js'
import { HandleableBuilder } from './handleable-builder.js'
import { createPipeline } from 'quiver-pipeline'

export class PipelineHandler extends HandleableBuilder {
  constructor(handlerComponents, options) {
    this._pipelineHandlers = handlerComponents

    var builders = handlerComponents.map(component => {
      if(!(component instanceof HandlerComponent)) {
        throw new Error('pipeline components must be of type HandlerComponent')
      }

      return component.handleableBuilder
    })

    var handleableBuilder = createPipeline(builders)
    super(handleableBuilder, options)
  }
}
