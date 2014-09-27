import { Component, HandlerComponent } from './component.js'
import { configMiddleware } from './simple-middleware.js'
import {
  loadHandleable,
  loadStreamHandler,
  loadHttpHandler,
  simpleHandlerLoader
} from './util/loader.js'

import { async } from 'quiver-promise'
import { copy, assertInstanceOf } from 'quiver-object'

var assertHandlerComponent = handler =>
  assertInstanceOf(handler, HandlerComponent,
    'handler implementation must be ' +
    'of type HandlerComponent')

var assertRepeatedField = (fields, fieldName) => {
  if(fields[fieldName])
    throw new Error('Field of the same name is ' + 
      'already defined in protocol: ' + fieldName)
}

export var loadProtocolHandlers = async(function*(config, implMap) {
  var handlerMap = { }

  for(var key in implMap) {
    var { component, loader } = implMap[key]
    handlerMap[key] = yield loader(config, component)
  }

  return handlerMap
})

class ProtocolImpl extends Component {
  constructor(implMap) {
    this._implMap = implMap
  }

  loadHandlers(config) {
    return loadProtocolHandlers(config, this._implMap)
  }

  privatize(privateInstance, privateTable) {
    var implMap = this._implMap
    var newImplMap = { }

    for(var key in implMap) {
      var { component, loader } = implMap[key]

      newImplMap[key] = { 
        loader, 
        component: component.makePrivate(privateTable) 
      }
    }

    privateInstance._implMap = newImplMap

    super.privatize(privateInstance, privateTable)
  }
}

export class Protocol extends Component {
  constructor(options={}) {
    this._loaderMap = []
    this._subprotocols = []

    super(options)
  }

  customHandler(handlerName, loader) {
    var loaderMap = this._loaderMap

    assertRepeatedField(loaderMap, handlerName)

    loaderMap[handlerName] = loader

    return this
  }

  handleable(handlerName) {
    return this.customHandler(handlerName, loadHandleable)
  }

  streamHandler(handlerName) {
    return this.customHandler(handlerName, loadStreamHandler)
  }

  httpHandler(handlerName) {
    return this.customHandler(handlerName, loadHttpHandler)
  }

  simpleHandler(handlerName, inType, outType) {
    return this.customHandler(handlerName,
      simpleHandlerLoader(inType, outType))
  }

  subprotocol(protocol) {
    assertInstanceOf(protocol, Protocol,
      'protocol must be instance of Protocol')

    var subLoaders = protocol._loaderMap

    for(var key in subLoaders) {
      this.customHandler(key, subLoaders[key])
    }

    return this
  }

  implement(implHandlers) {
    var loaderMap = this._loaderMap
    var implMap = { }

    for(var key in loaderMap) {
      var loader = loaderMap[key]
      var component = implHandlers[key]

      if(!component) throw new Error(
        'missing handler in implementation: ' + key)

      assertHandlerComponent(component)

      implMap[key] = { loader, component }
    }

    return new ProtocolImpl(implMap)
  }
}

export var protocol = () => new Protocol()