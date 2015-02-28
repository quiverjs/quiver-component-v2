import { assertString } from 'quiver-object'

import { ConfigMiddleware } from './simple-middleware'
import { HandlerComponent } from './component'
import { ExtensibleComponent } from './extensible-component'

export class InputHandlerMiddleware extends ConfigMiddleware {
  constructor(handlerComponent, toConfig, options={}) {
    if(!handlerComponent.isHandlerComponent) {
      throw new TypeError(
        'input handler must be of type HandlerComponent')
    }

    assertString(toConfig, 'toConfig required to be string')

    let { 
      loader=handlerComponent.handlerLoader
    } = options

    this._handlerLoader = loader
    
    this._toInputConfig = toConfig

    options.safeWrapped = true

    super(null, options)
    
    this.subComponents.inputHandler = handlerComponent
  }

  toConfigHandler() {
    let handlerComponent = this.inputHandlerComponent

    let componentId = handlerComponent.id
    let builder = handlerComponent.toHandleableBuilder()

    let loader = this._handlerLoader
    let toConfig = this._toInputConfig

    return config =>
      loader(config, componentId, builder)
      .then(handler => {
        config[toConfig] = handler
      })
  }

  get inputHandlerComponent() {
    return this.subComponents.inputHandler
  }

  get type() {
    return 'input handler middleware'
  }

  toJson() {
    let json = super.toJson()
    json.inputHandler = this.inputHandlerComponent.toJson()
    return json
  }
}

let InputHandlerMixin = {
  inputHandler(handler, toConfig, options={}) {
    return this.middleware(
      new InputHandlerMiddleware(
        handler, toConfig, options))
  },
  inputHandlers(handlerMap) {
    for(let key in handlerMap) {
      let handler = handlerMap[key]
      this.inputHandler(handler, key)
    }
    return this
  }
}

let mixinInputHandler = prototype =>
  Object.assign(prototype, InputHandlerMixin)

mixinInputHandler(ExtensibleComponent.prototype)

export let inputHandlerMiddleware = (handler, toConfig, options) =>
  new InputHandlerMiddleware(handler, toConfig, options)
