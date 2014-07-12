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

    this._handlerLoader = loader
    this._inputHandlerComponent = handlerComponent
    this._toInputConfig = toConfig

    options.safeWrapped = true

    super(null, options)
  }

  get configHandler() {
    var handlerComponent = this.inputHandlerComponent
    var loader = this._handlerLoader
    var toConfig = this._toInputConfig

    return config => {
      if(config[toConfig]) return config

      return loader(config, handlerComponent)
        .then(handler => {
          config[toConfig] = handler

          return config
        })
    }
  }

  get inputHandlerComponent() {
    return this._inputHandlerComponent
  }

  privatize(privateCopy, bundle) {
    privateCopy._inputHandlerComponent = 
      this._inputHandlerComponent.makePrivate(bundle)

    super.privatize(privateCopy, bundle)
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

export var inputHandlerMiddleware = (handler, toConfig, options) =>
  new InputHandlerMiddleware(handler, toConfig, options)
