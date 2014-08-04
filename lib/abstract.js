import { Protocol } from './protocol.js'
import { ConfigMiddleware } from './simple-middleware.js'
import { HandlerComponent, MiddlewareComponent } from './component.js'

import { async } from 'quiver-promise'
import { assertInstanceOf } from 'quiver-object'

var protocolMiddleware = (configKey, loader) =>
  configMiddleware(async(function*(config) {
    config[configKey] = yield loader(config)

    return config
  }))

class ProtocolMiddleware extends ConfigMiddleware {
  constructor(configKey, protocolImpl, options={}) {
    this._configKey = configKey
    this._protocolImpl = protocolImpl

    options.safeWrapped = true

    super(null, options)
  }

  get configHandler() {
    var configKey = this._configKey
    var protocolImpl = this._protocolImpl

    return async(function*(config) {
      config[configKey] = yield protocolImpl.load(config)

      return config
    })
  }

  privatize(privateCopy, bundle) {
    privateCopy._protocolImpl = 
      this._protocolImpl.makePrivate(bundle)

    super.privatize(privateCopy, bundle)
  }
}

export var abstractComponent = (configKey, protocol, component) => {
  assertInstanceOf(protocol, Protocol,
    'protocol must be instance of Protocol')

  if(!(component instanceof HandlerComponent ||
       component instanceof MiddlewareComponent))
  {
    throw new Error('component must be either handler or middleware')
  }

  return implBundle => {
    var protocolImpl = protocol.implement(implBundle)

    var protocolMiddleware = new ProtocolMiddleware(
      configKey, protocolImpl)

    var concreteComponent = component.makePrivate()
      .addMiddleware(protocolMiddleware)

    return concreteComponent
  }
}