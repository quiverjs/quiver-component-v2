import { assertInstanceOf, assertString } from 'quiver-object'

import { HandlerComponent } from './component.js'
import { ConfigMiddleware } from './simple-middleware.js'

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

      return loader(config, handlerComponent,options)
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

export class PrivateInputMiddleware extends ConfigMiddleware {
  constructor(handlerComponent, toConfig, options={}) {
    assertInstanceOf(handlerComponent, HandlerComponent,
      'input handler must be of type HandlerComponent')

    assertString(toConfig, 'toConfig required to be string')

    var { loader=loadHandler } = options

    this._inputHandlerComponent = handlerComponent

    var initKey = Symbol('middlewareInitialized')

    var middleware = config => {
      if(config[initKey]) return config

      return loader(config, handlerComponent, { loadPrivate: true })
        .then(handler => {
          config[toConfig] = handler
          config[initKey] = true

          return config
        })
    }

    super(middleware, options)
  }

  get inputHandlerComponent() {
    return this._inputHandlerComponent
  }

  get type() {
    return 'private input handler middleware'
  }

  toJson() {
    var json = super.toJson()
    json.inputHandler = this.inputHandlerComponent.toJson()
    return json
  }
}