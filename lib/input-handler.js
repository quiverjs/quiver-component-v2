import { HandlerComponent } from './component.js'
import { HandleableMiddleware } from './handleable-middleware.js'

export class InputHandlerMiddleware extends HandleableMiddleware {
  constructor(handlerComponent, toConfig, options={}) {
    if(!(handlerComponent instanceof HandlerComponent))
      throw new TypeError('input handler component must be of type HandlerComponent')

    if(typeof(toConfig) != 'string')
      throw new TypeError('toConfig required to be string')

    this._inputHandlerComponent = handlerComponent

    var middleware = (config, builder) => {
      if(config[toConfig]) return builder(config)

      return handlerComponent.loadHandler(config, options)
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

  get type() {
    return 'input handler middleware'
  }

  toJson() {
    var json = super.toJson()
    json.inputHandler = this.inputHandlerComponent.toJson()
    return json
  }
}
