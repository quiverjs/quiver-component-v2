import { copy } from 'quiver-object'
import { error } from 'quiver-error'
import { async, reject, safePromised } from 'quiver-promise'
import { simpleToStreamHandler } from 'quiver-simple-handler'

import { Component } from './component'
import { ExtensibleHandler } from './extensible-component'
import { StreamHandlerBuilder } from './stream-handler'
import { getBundleMap } from './util/config'

import { 
  loadStreamHandler, simpleHandlerLoader 
} from './util/loader'

export let loadHandlerFromBundle = async(
function*(config, handlerName, componentId, bundleBuilder) {
  let bundleMap = getBundleMap(config)
  let bundle = bundleMap[componentId]

  if(!bundle) {
    bundle = yield bundleBuilder(config)
    bundleMap[componentId] = bundle
  }

  let handler = bundle[handlerName]
  if(!handler) throw new Error(
    'handler not found in bundle: ' + handlerName)

  return handler
})

let bundleHandlerLoader = (handlerName, bundleComponent) => {
  let componentId = bundleComponent.id
  let bundleBuilder = bundleComponent.toBundleBuilder()

  return config => loadHandlerFromBundle(
    config, handlerName, componentId, bundleBuilder)
}

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

  toStreamHandlerBuilder() {
    return bundleHandlerLoader(
      this._handlerName, this._bundleComponent)
  }

  get handlerConverter() {
    return this._handlerConverter
  }

  get defaultLoader() {
    return this._handlerLoader
  }

  /*
   * Specialized mechanism for forking a bundle field
   */
  fork(forkTable={}) {
    let componentId = this.id

    /*
     * If the fork table already have an entry,
     * return it as usual.
     */
    if(forkTable[componentId]) {
      return forkTable[componentId]
    }

    let handlerName = this._handlerName
    let bundleComponent = this._bundleComponent
    let bundleId = bundleComponent.id

    let forkedBundle = forkTable[bundleId]
    /*
     * If the bundle is not forked,
     * fork the bundle and return the field.
     *
     * During the bundle fork, this.fork()
     * will be called again, but this time with
     * the forked bundle exist in forkTable.
     */
    if(!forkedBundle) {
      return bundleComponent.fork(forkTable)
        .toHandlerComponents()[handlerName]
    }

    /*
     * If the bundle is already forked, this.fork()
     * is probably being called the second time.
     * We make a shallow new instance using clone() 
     * and then apply forking as usual.
     */
    let forkedField = this.clone()
    forkedField._bundleComponent = forkedBundle

    forkTable[componentId] = forkedField

    this.doMap(forkedField,
      (component, mapTable) => 
        component.fork(mapTable),
      forkTable)

    return forkedField
  }
}

let bundleFields = (handlerNames, bundleComponent) =>
  handlerNames.map(handlerName => 
    new BundleField(handlerName, bundleComponent))

let streamHandlerConverter = handler => safePromised(handler)

let simpleHandlerConverter = (inType, outType) =>
  handler => simpleToStreamHandler(handler, inType, outType)

export class HandlerBundle extends ExtensibleHandler {
  constructor(bundleBuilder, options={}) {
    this._bundleBuilder = safePromised(bundleBuilder)
    this._bundleFields = { }

    super(options)
  }

  toHandleableBuilder() {
    return this.toBundleBuilder()
  }

  toBundleBuilder() {
    let builder = this._bundleBuilder
    let bundleFields = this.toHandlerComponents()

    return config =>
      builder(config).then(bundle => {
        let convertedBundle = { }

        for(let key in bundleFields) {
          let bundleField = bundleFields[key]
          let handlerConverter = bundleField.handlerConverter
          let handler = bundle[key]

          if(!handler) return reject(error(500, 
            'required handler not found ' +
            'in bundle result: ' + key))

          convertedBundle[key] = handlerConverter(handler)
        }

        return convertedBundle
      })
  }

  toHandlerComponents() {
    return this._bundleFields
  }

  bundleField(handlerName, handlerConverter, handlerLoader) {
    let bundleFields = this._bundleFields

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

  each(iteratee) {
    let bundleFields = this._bundleFields
    
    for(let key in bundleFields) {
      iteratee(bundleFields[key])
    }

    super.each(iteratee)
  }

  doMap(target, mapper, mapTable) {
    let bundleFields = this._bundleFields
    let mappedFields = { }

    for(let key in bundleFields) {
      let bundleField = bundleFields[key]
      let mappedField = mapper(bundleField, mapTable)

      mappedFields[key] = mappedField
    }

    target._bundleFields = mappedFields

    super.doMap(target, mapper, mapTable)
  }

  addMiddleware(middlewareComponent) {
    let bundleFields = this._bundleFields

    for(let key in bundleFields) {
      bundleFields[key].addMiddleware(middlewareComponent)
    }

    return this
  }

  middleware(middlewareComponent) {
    return this.addMiddleware(middlewareComponent)
  }
}

export let handlerBundle = (bundleBuilder, handlerNames) => 
  new HandlerBundle(bundleBuilder, handlerNames)