import { async } from 'quiver-promise'
import { simpleToStreamHandler } from 'quiver-simple-handler'

import { extendHandler } from './extend'
import { HandleableBuilder } from './handleable-builder'
import { handleableMiddleware } from './handleable-middleware'

import { 
  loadStreamHandler, simpleHandlerLoader 
} from './util/loader'

let _bundleFields = Symbol('bundleFields')

let streamHandlerConverter = handler => ({
  streamHandler: safePromised(handler)
})

let simpleHandlerConverter = (inType, outType) =>
  handler => ({
    streamHandler: simpleToStreamHandler(handler, inType, outType)
  })

let bundleFieldMiddleware = (field, handlerConverter) =>
  handleableMiddleware(async(
    function*(config, builder) {
      let bundle = yield builder(config)
      let handler = bundle[field]

      if(!handler) {
        throw new Error('missing handler field in bundle: ' + field)
      }

      return handlerConverter(handler)
    }))

let bundleFieldComponent = 
(bundleComponent, field, handlerConverter, handlerLoader) =>
  extendHandler(bundleComponent)
    .middleware(bundleFieldMiddleware(field, handlerConverter))
    .setLoader(handlerLoader)

export class HandlerBundle extends HandleableBuilder {
  constructor(bundleBuilder, options={}) {
    this[_bundleFields] = { }
    super(bundleBuilder, options={})
  }

  toHandlerComponents() {
    let handlerComponents = {}
    let bundleFields = this[_bundleFields]

    for(let field in bundleFields) {
      let {
        handlerConverter, handlerLoader 
      } = bundleFields[field]
      
      handlerComponents[field] = bundleFieldComponent(
        this, field, handlerConverter, handlerLoader)
    }

    return handlerComponents
  }

  bundleField(handlerName, handlerConverter, handlerLoader) {
    let bundleFields = this[_bundleFields]

    if(bundleFields[handlerName]) throw new Error(
      'bundle field is already defined: ' + handlerName)

    bundleFields[handlerName] = { handlerConverter, handlerLoader }

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
}

export let handlerBundle = bundleBuilder =>
  new HandlerBundle(bundleBuilder)