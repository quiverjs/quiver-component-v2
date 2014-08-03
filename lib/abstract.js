import { Protocol } from './protocol.js'
import { HandlerComponent } from './component.js'
import { configMiddleware } from './simple-middleware.js'

import { async } from 'quiver-promise'
import { assertInstanceOf } from 'quiver-object'

var protocolMiddleware = (configKey, loader) =>
  configMiddleware(async(function*(config) {
    config[configKey] = yield loader(config)

    return config
  }))

export var abstractComponent = (protocol, configKey, component) => {
  assertInstanceOf(protocol, Protocol,
    'protocol must be instance of Protocol')

  if(!(component instanceof HandlerComponent ||
       component instanceof MiddlewareComponent))
  {
    throw new Error('component must be either handler or middleware')
  }

  return implMap => {
    var loader = protocol.concreteLoader(implMap)

    var concreteComponent = component.makePrivate()
      .addMiddleware(protocolMiddleware(configKey, loader))

    return concreteComponent
  }
}