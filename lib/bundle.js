import { async } from 'quiver-promise'

import { Component } from './component.js'
import { getBundleMap } from './util/config.js'

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
  config =>
    loadHandlerFromBundle(config, handlerName, bundleComponent)

var bundleField = (handlerName, bundleComponent) =>
  handleableBuilder(bundleHandlerLoader(
    handlerName, bundleComponent))

class BundleField extends StreamHandlerBuilder {
  constructor(handlerName, bundleComponent) {
    this._handlerName = handlerName
    this._bundleComponent = bundleComponent
  }

  get streamHandlerBuilder() {
    return bundleHandlerLoader(
      this._handlerName, this._bundleComponent)
  }

  makePrivate(privateTable={}) {
    var handlerName = this._handlerName
    var bundleComponent = this._bundleComponent

    return bundleComponent.makePrivate(privateTable)
      .handlerComponents[handlerName]
  }
}

var bundleFields = (handlerNames, componentBundle) =>
  handlerNames.map(handlerName => 
    new BundleField(handlerName, componentBundle))

export class ComponentBundle extends Component {
  constructor(bundleBuilder, handlerNames, options={}) {
    this._bundleBuilder = bundleBuilder
    this._handlerNames = handlerNames
    this._handlerComponents = bundleFields(handlerNames, this)

    super(options)
  }

  get bundleBuilder() {
    return this._bundleBuilder
  }

  get handlerNames() {
    return this._handlerNames
  }

  get handlerComponents() {
    return this._handlerComponents
  }

  privatize(privateInstance, privateTable) {
    privateInstance._handlerComponents = bundleFields(
      this._handlerNames, this)

    super.privatize(privateInstance, privateTable)
  }
}

export var componentBundle = (bundleBuilder, handlerNames) => 
  new ComponentBundle(bundleBuilder, handlerNames)