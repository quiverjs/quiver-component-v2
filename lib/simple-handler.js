import { resolve } from 'quiver-promise'

import { 
  simpleToStreamHandler, 
  streamToSimpleHandler,
  validateSimpleTypes 
} from 'quiver-simple-handler'

import { safeBuilder, safeHandler } from './util/wrap.js'
import { StreamHandler, StreamHandlerBuilder } from './stream-handler.js'

export class SimpleHandlerBuilder extends StreamHandlerBuilder {
  constructor(simpleHandlerBuilder, inType, outType, options={}) {
    var err = validateSimpleTypes([inType, outType])
    if(err) throw err

    this._inType = inType
    this._outType = outType
    this._simpleHandlerBuilder = simpleHandlerBuilder

    simpleHandlerBuilder = safeBuilder(simpleHandlerBuilder, options)

    var streamHandlerBuilder = config =>
      resolve(simpleHandlerBuilder(config))
      .then(simpleHandler =>
        simpleToStreamHandler(simpleHandler, inType, outType))

    super(streamHandlerBuilder, options)
  }

  loadHandler(config, options) {
    return super.loadHandler(config, options)
    .then(streamHandler =>
      streamToSimpleHandler(streamHandler, this._inType, this._outType))
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
    this._simpleHandler = simpleHandler

    simpleHandler = safeHandler(simpleHandler, options)

    var simpleHandlerBuilder = config =>
      resolve(simpleHandler)

    super(simpleHandlerBuilder, inType, outType, options)
  }

  get type() {
    return 'simple handler'
  }
}
