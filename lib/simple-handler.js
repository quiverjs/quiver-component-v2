import { resolve } from 'quiver-promise'

import { 
  simpleToStreamHandler, 
  streamToSimpleHandler,
  validateSimpleTypes 
} from 'quiver-simple-handler'

import { StreamHandler, StreamHandlerBuilder } from './stream-handler.js'

export class SimpleHandlerBuilder extends StreamHandlerBuilder {
  constructor(simpleHandlerBuilder, options={}) {
    var { inType, outType } = options

    validateSimpleTypes([inType, outType])

    this._inType = inType
    this._outType = outType
    this._simpleHandlerBuilder = simpleHandlerBuilder

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
}

export class SimpleHandler extends SimpleHandlerBuilder {
  constructor(simpleHandler, options={}) {
    if(typeof(simpleHandler) != 'function') {
      throw new TypeError('must construct with simple handler function')
    }

    this._simpleHandler = simpleHandler

    var simpleHandlerBuilder = config =>
      resolve(simpleHandler)

    super(simpleHandlerBuilder, options)
  }
}
