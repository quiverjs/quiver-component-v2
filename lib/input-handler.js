import { assertString } from 'quiver-object'

import { ConfigMiddleware } from './simple-middleware'
import { HandlerComponent } from './component'
import { ExtensibleHandler, ExtensibleMiddleware } from './extensible-component'

var loadHandler = (config, component, options) => 
  component.loadHandler(config, options)

export class InputHandlerMiddleware extends ConfigMiddleware {
  constructor(handlerComponent, toConfig, options={}) {
    if(!handlerComponent.isHandlerComponent) {
      throw new TypeError(
        'input handler must be of type HandlerComponent')
    }

    assertString(toConfig, 'toConfig required to be string')

    var { 
      loader=loadHandler,
    } = options

    this._handlerLoader = loader
    
    this._toInputConfig = toConfig

    options.safeWrapped = true

    super(null, options)
    
    this.subComponents.inputHandler = handlerComponent
  }

  toConfigHandler() {
    var handlerComponent = this.inputHandlerComponent
    var loader = this._handlerLoader
    var toConfig = this._toInputConfig

    return config =>
      loader(config, handlerComponent)
      .then(handler => {
        config[toConfig] = handler

        return config
      })
  }

  get inputHandlerComponent() {
    return this.subComponents.inputHandler
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

var InputHandlerMixin = {
  inputHandler: function(handler, toConfig, options={}) {
    return this.addMiddleware(
      new InputHandlerMiddleware(
        handler, toConfig, options))
  },
  inputHandlers: function(handlerMap) {
    for(var key in handlerMap) {
      var handler = handlerMap[key]
      this.inputHandler(handler, key)
    }
    return this
  }
}

var mixinInputHandler = prototype => {
  Object.assign(prototype, InputHandlerMixin)
}

mixinInputHandler(ExtensibleHandler.prototype)
mixinInputHandler(ExtensibleMiddleware.prototype)

export var inputHandlerMiddleware = (handler, toConfig, options) =>
  new InputHandlerMiddleware(handler, toConfig, options)
