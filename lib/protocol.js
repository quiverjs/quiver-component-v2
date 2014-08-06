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

var assertHandlerComponent = handler =>
  assertInstanceOf(handler, HandlerComponent,
    'handler implementation must be ' +
    'of type HandlerComponent')

var assertRepeatedField = (fields, fieldName) => {
  if(fields[fieldName])
    throw new Error('Field of the same name is ' + 
      'already defined in protocol: ' + fieldName)
}

var loadProtocol = async(function*(config, implMap) {
  var bundleResult = { }

  for(var implName in implMap) {
    var impl = implMap[implName]

    bundleResult[implName] = yield impl.load(config)
  }

  return bundleResult
})

class HandlerProtocolImpl extends Component {
  constructor(handlerComponent, handlerLoader) {
    assertHandlerComponent(handlerComponent)

    this._handlerLoader = handlerLoader
    this._handlerComponent = handlerComponent
  }

  load(config) {
    return this._handlerLoader(
      config, this._handlerComponent)
  }

  privatize(privateInstance, privateTable) {
    privateInstance._handlerComponent = 
      this._handlerComponent.makePrivate(privateTable)
  }
}

class ProtocolImpl extends Component {
  constructor(implMap) {
    this._implMap = implMap
  }

  load(config) {
    return loadProtocol(config, this._implMap)
  }

  privatize(privateInstance, privateTable) {
    var implMap = this._implMap
    var privateImplMap = { }

    for(var implName in implMap) {
      privateImplMap[implName] = 
        implMap[implName].makePrivate(privateTable)
    }

    privateInstance._implMap = privateImplMap
  }
}

export class Protocol extends Component {
  constructor(options={}) {
    this._fields = { }

    super(options)
  }

  customHandler(handlerName, loader) {
    var fields = this._fields

    assertRepeatedField(fields, handlerName)

    fields[handlerName] = handlerComponent =>
      new HandlerProtocolImpl(handlerComponent, loader)

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

  subprotocol(protocolName, protocol) {
    assertInstanceOf(protocol, Protocol,
      'protocol must be instance of Protocol')

    var fields = this._fields

    assertRepeatedField(fields, protocolName)

    fields[protocolName] = implBundle =>
      protocol.implement(implBundle)

    return this
  }

  implement(implBundle) {
    var fields = this._fields
    var implMap = { }

    for(var fieldName in fields) {
      var field = fields[fieldName]
      var impl = implBundle[fieldName]

      if(!impl) throw new Error(
        'missing field in implementation: ' + fieldName)

      implMap[fieldName] = field(impl)
    }

    return new ProtocolImpl(implMap)
  }
}

export var protocol = () => new Protocol()