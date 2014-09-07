import { Protocol } from './protocol.js'
import { ConfigMiddleware } from './simple-middleware.js'
import { 
  Component, 
  HandlerComponent, 
  MiddlewareComponent 
} from './component.js'

import { async } from 'quiver-promise'
import { assertInstanceOf } from 'quiver-object'

var assertHandlerComponent = handler =>
  assertInstanceOf(handler, HandlerComponent,
    'handler implementation must be ' +
    'of type HandlerComponent')

var protocolMiddleware = (configKey, loader) =>
  configMiddleware(async(function*(config) {
    config[configKey] = yield loader(config)

    return config
  }))

class ProtocolMiddleware extends ConfigMiddleware {
  constructor(configKey, protocolImpl, options={}) {
    this._configKey = configKey

    options.safeWrapped = true

    super(null, options)
    this.subComponents.protocolImpl = protocolImpl
  }

  get configHandler() {
    var configKey = this._configKey
    var { protocolImpl } = this.subComponents

    return config =>
      protocolImpl.loadHandlers(config).then(handlerMap => {
        config[configKey] = handlerMap

        return config
      })
  }
}

class AbstractComponent extends Component {
  constructor(configKey, protocol, component) {
    assertInstanceOf(protocol, Protocol,
      'protocol must be instance of Protocol')

    if(!(component instanceof HandlerComponent ||
         component instanceof MiddlewareComponent))
    {
      throw new Error('component must be either handler or middleware')
    }

    this._configKey = configKey
    this._protocol = protocol
    this._component = component
    this._implBundle = { }

    super()
  }

  implement(handlerMap, privateTable={}) {
    var privateCopy = this.makePrivate(privateTable)

    var implBundle = privateCopy._implBundle

    for(var key in handlerMap) {
      var component = handlerMap[key]
      assertHandlerComponent(component)

      implBundle[key] = component
    }

    return privateCopy
  }

  privatize(privateInstance, privateTable) {
    var newImpl = { }
    var implBundle = this._implBundle

    for(var key in implBundle) {
      newImpl[key] = implBundle[key]
        .makePrivate(privateTable)
    }

    privateInstance._implBundle = newImpl

    super.privatize(privateInstance, privateTable)
  }

  concretize() {
    var configKey = this._configKey
    var protocol = this._protocol
    var component = this._component
    var implBundle = this._implBundle

    var protocolImpl = protocol.implement(implBundle)

    var protocolMiddleware = new ProtocolMiddleware(
      configKey, protocolImpl)

    var concreteComponent = component.makePrivate()
      .addMiddleware(protocolMiddleware)

    return concreteComponent
  }

  get rawComponent() {
    return this._component
  }
}

export var abstractComponent = (configKey, protocol, component) =>
  new AbstractComponent(configKey, protocol, component)