import { HandlerComponent } from './handler.js'
import { HandleableMiddleware } from './handleable-middleware.js'

export class InputHandlerMiddleware extends HandleableMiddleware {
  constructor(handlerComponent, options={}) {
    var { loadOptions } = options

    if(!(handlerComponent instanceof HandlerComponent)) {
      throw new TypeError('input handler component must be of type HandlerComponent')
    }

    this._handlerComponent = handlerComponent

    var middleware = (config, builder) =>
      handlerComponent.loadHandler(config, loadOptions)
        .then(builder)

    super(middleware, options)
  }
}
