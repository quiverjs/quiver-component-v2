import { Component, HandlerComponent } from './component.js'
import { configMiddleware } from './simple-middleware.js'
import {
  loadHandleable,
  loadStreamHandler,
  loadHttpHandler,
  simpleHandlerLoader
} from './util/loader.js'

import { async } from 'quiver-promise'
import { assertInstanceOf } from 'quiver-object'

var loadProtocol = async(function*(config, loaderMap) {
  var bundleResult = { }

  for(var handlerName in loaderMap) {
    var loader = loaderMap[handlername]

    bundleResult[handlerName] = yield loader(config)
  }

  return bundleResult
})

var protocolLoader = loaderMap =>
  config => loadProtocol(config, loaderMap)

var metaProtocolLoader = protocol =>
  implMap =>
    protocol.concreteLoader(implMap)

var metaHandlerLoader = handlerLoader =>
  handlerComponent => {
    assertInstanceOf(handlerComponent, HandlerComponent,
      'handler implementation must be ' +
      'of type HandlerComponent')

    return config =>
      handlerLoader(config, handlerComponent)
  }

export class Protocol extends Component {
  constructor(options={}) {
    this._metaLoaderMap = { }
  }

  customHandler(handlerName, loader) {
    var metaLoaderMap = this._metaLoaderMap

    if(metaLoaderMap[handlerName])
      throw new Error('Field of the same name is ' + 
        'already defined in protocol: ' + handlerName)

    metaLoaderMap[handlerName] = metaHandlerLoader(loader)

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

  protocol(protocolName, protocol) {
    assertInstanceOf(protocol, Protocol,
      'protocol must be instance of Protocol')

    var metaLoaderMap = this._metaLoaderMap

    if(metaLoaderMap[protocolName])
      throw new Error('Field of the same name is ' + 
        'already defined in protocol: ' + protocolName)

    metaLoaderMap[protocolName] = metaProtocolLoader(protocol)

    return this
  }

  concreteLoader(implMap) {
    var metaLoaderMap = this._metaLoaderMap
    var loaderMap = { }

    for(var field in metaLoaderMap) {
      var metaLoader = metaLoaderMap[field]
      var impl = implMap[field]

      loaderMap[field] = metaLoader(impl)
    }

    return protocolLoader(loaderMap)
  }
}