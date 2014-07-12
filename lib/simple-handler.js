import { resolve } from 'quiver-promise'

import { 
  simpleToStreamHandler, 
  streamToSimpleHandler,
  validateSimpleTypes 
} from 'quiver-simple-handler'

import { simpleHandlerLoader } from './util/loader.js'
import { safeBuilder, safeHandler } from './util/wrap.js'
import { StreamHandler, StreamHandlerBuilder } from './stream-handler.js'

export class SimpleHandlerBuilder extends StreamHandlerBuilder {
  constructor(simpleHandlerBuilder, inType, outType, options={}) {
    var err = validateSimpleTypes([inType, outType])
    if(err) throw err

    this._inType = inType
    this._outType = outType

    this._simpleHandlerBuilder = safeBuilder(
      simpleHandlerBuilder, options)

    super(null, options)
  }

  get streamHandlerBuilder() {
    var {
      simpleHandlerBuilder, inType, outType
    } = this

    return config =>
      simpleHandlerBuilder(config)
      .then(simpleHandler =>
        simpleToStreamHandler(simpleHandler, inType, outType))
  }

  get simpleHandlerBuilder() {
    if(!this._simpleHandlerBuilder) throw new Error(
      'simpleHandlerBuilder is not define')

    return this._simpleHandlerBuilder
  }

  get handlerLoader() {
    return simpleHandlerLoader(this.inType, this.outType)
  }

  get inType() {
    return this._inType
  }

  get outType() {
    return this._outType
  }

  get type() {
    return 'simple handler builder'
  }

  toJson() {
    var json = super.toJson()

    json.inType = this.inType
    json.outType = this.outType

    return json
  }
}

export class SimpleHandler extends SimpleHandlerBuilder {
  constructor(simpleHandler, inType, outType, options={}) {
    this._simpleHandler = safeHandler(simpleHandler, options)

    super(null, inType, outType, options)
  }

  get simpleHandlerBuilder() {
    var simpleHandler = this.simpleHandler

    return config =>
      resolve(simpleHandler)
  }

  get simpleHandler() {
    if(!this._simpleHandler) throw new Error(
      'simpleHandler is not defined')

    return this._simpleHandler
  }

  get type() {
    return 'simple handler'
  }
}

export var simpleHandlerBuilder = (builder, inType, outType, options) =>
  new SimpleHandlerBuilder(builder, inType, outType, options)

export var simpleHandler = (handler, inType, outType, options) =>
  new SimpleHandler(handler, inType, outType, options)