import { HandlerComponent } from './component.js'
import { HandleableMiddleware } from './handleable-middleware.js'

export class InputHandlerMiddleware extends HandleableMiddleware {
  constructor(handlerComponent, options={}) {
    var { loadOptions, toConfig } = options

    if(!(handlerComponent instanceof HandlerComponent)) {
      throw new TypeError('input handler component must be of type HandlerComponent')
    }

    if(typeof(toConfig) != 'string') {
      throw new TypeError('options.toConfig required to be string')
    }

    this._inputHandlerComponent = handlerComponent

    var middleware = (config, builder) => {
      if(config[toConfig]) return builder(config)

      return handlerComponent.loadHandler(config, loadOptions)
        .then(handler => {
          config[toConfig] = handler

          return builder(config)
        })
    }

    super(middleware, options)
  }

  get inputHandlerComponent() {
    return this._inputHandlerComponent
  }
}
