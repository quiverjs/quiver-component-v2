import { copy } from 'quiver-object'
import { error } from 'quiver-error'
import { async, reject, safePromised } from 'quiver-promise'
import { simpleToStreamHandler } from 'quiver-simple-handler'

import { Component } from './component'
import { StreamHandlerBuilder } from './stream-handler'
import { getBundleMap } from './util/config'

import { 
  loadStreamHandler, simpleHandlerLoader 
} from './util/loader'

export var loadHandlerFromBundle = async(
function*(config, handlerName, component) {
  var componentId = component.id
  var bundleMap = getBundleMap(config)
  var bundle = bundleMap[componentId]

  if(!bundle) {
    var bundleBuilder = component.bundleBuilder

    bundle = yield bundleBuilder(config)
    bundleMap[componentId] = bundle
  }

  var handler = bundle[handlerName]
  if(!handler) throw new Error(
    'handler not found in bundle: ' + handlerName)

  return handler
})

var bundleHandlerLoader = (handlerName, bundleComponent) =>
  config => loadHandlerFromBundle(
    config, handlerName, bundleComponent)

class BundleField extends StreamHandlerBuilder {
  constructor(
    handlerName, bundleComponent, 
    handlerConverter, handlerLoader, options={}) 
  {
    this._handlerName = handlerName
    this._bundleComponent = bundleComponent
    this._handlerConverter = handlerConverter
    this._handlerLoader = handlerLoader

    options.safeWrapped = true

    super(null, options)
  }

  get streamHandlerBuilder() {
    return bundleHandlerLoader(
      this._handlerName, this._bundleComponent)
  }

  get handlerConverter() {
    return this._handlerConverter
  }

  get handlerLoader() {
    return this._handlerLoader
  }

  makePrivate(privateTable={}) {
    var handlerName = this._handlerName
    var bundleComponent = this._bundleComponent

    return bundleComponent.makePrivate(privateTable)
      .handlerComponents[handlerName]
  }

  _makePrivate(privateTable={}) {
    return super.makePrivate(privateTable)
  }
}

var bundleFields = (handlerNames, bundleComponent) =>
  handlerNames.map(handlerName => 
    new BundleField(handlerName, bundleComponent))

var streamHandlerConverter = handler => safePromised(handler)

var simpleHandlerConverter = (inType, outType) =>
  handler => simpleToStreamHandler(handler, inType, outType)

export class HandlerBundle extends Component {
  constructor(bundleBuilder, options={}) {
    this._bundleBuilder = safePromised(bundleBuilder)
    this._bundleFields = { }

    super(options)
  }

  get bundleBuilder() {
    var builder = this._bundleBuilder
    var bundleFields = this.handlerComponents

    return config =>
      builder(config).then(bundle => {
        var convertedBundle = { }

        for(var key in bundleFields) {
          var bundleField = bundleFields[key]
          var handlerConverter = bundleField.handlerConverter
          var handler = bundle[key]

          if(!handler) return reject(error(500, 
            'required handler not found ' +
            'in bundle result: ' + key))

          convertedBundle[key] = handlerConverter(handler)
        }

        return convertedBundle
      })
  }

  get handlerComponents() {
    return copy(this._bundleFields)
  }

  bundleField(handlerName, handlerConverter, handlerLoader) {
    var bundleFields = this._bundleFields

    if(bundleFields[handlerName]) throw new Error(
      'bundle field is already defined: ' + handlerName)

    bundleFields[handlerName] = new BundleField(
      handlerName, this, handlerConverter, handlerLoader)

    return this
  }

  streamHandler(handlerName) {
    return this.bundleField(handlerName, 
      streamHandlerConverter, loadStreamHandler)
  }

  simpleHandler(handlerName, inType, outType) {
    return this.bundleField(handlerName,
      simpleHandlerConverter(inType, outType), 
      simpleHandlerLoader(inType, outType))
  }

  privatize(privateInstance, privateTable) {
    var bundleFields = this._bundleFields
    var privateFields = { }

    for(var key in bundleFields) {
      var bundleField = bundleFields[key]

      var privateField = bundleField._makePrivate(privateTable)
      privateField._bundleComponent = privateInstance

      privateFields[key] = privateField
    }

    privateInstance._bundleFields = privateFields

    super.privatize(privateInstance, privateTable)
  }

  addMiddleware(middleware) {
    var bundleFields = this._bundleFields

    for(var key in bundleFields) {
      bundleFields[key].addMiddleware(middleware)
    }

    return this
  }
}

export var handlerBundle = (bundleBuilder, handlerNames) => 
  new HandlerBundle(bundleBuilder, handlerNames)