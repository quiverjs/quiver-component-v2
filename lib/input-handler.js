import { assertInstanceOf, assertString } from 'quiver-object'

import { HandlerComponent } from './component.js'
import { ConfigMiddleware } from './simple-middleware.js'
import { PrivateMiddleware } from './private-middleware.js'

var loadHandler = (config, component, options) => 
  component.loadHandler(config, options)

export class InputHandlerMiddleware extends ConfigMiddleware {
  constructor(handlerComponent, toConfig, options={}) {
    assertInstanceOf(handlerComponent, HandlerComponent,
      'input handler must be of type HandlerComponent')

    assertString(toConfig, 'toConfig required to be string')

    var { loader=loadHandler } = options

    this._inputHandlerComponent = handlerComponent

    var middleware = config => {
      if(config[toConfig]) return config

      return loader(config, handlerComponent, options)
        .then(handler => {
          config[toConfig] = handler

          return config
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

export class PrivateInputMiddleware extends PrivateMiddleware {
  constructor(handlerComponent, toConfig, options={}) {
    options.loadPrivate = true

    var inputMiddleware = new InputHandlerMiddleware(
      handlerComponent, toConfig, options)

    super(inputMiddleware)
  }
}

export var inputHandlerMiddleware = (handler, toConfig, options) =>
  new InputHandlerMiddleware(handler, toConfig, options)

export var privateInputMiddleware = (handler, toConfig, options) =>
  new PrivateInputMiddleware(handler, toConfig, options)