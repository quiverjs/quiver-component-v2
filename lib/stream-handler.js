import { resolve } from 'quiver-promise'

import { loadStreamHandler } from './util/loader.js'
import { safeBuilder, safeHandler } from './util/wrap.js'
import { HandleableBuilder } from './handleable-builder.js'

var streamToHandleableBuilder = streamBuilder =>
  config => resolve(streamBuilder(config))
  .then(streamHandler => ({
    get streamHandler() {
      return streamHandler
    }
  }))

export class StreamHandlerBuilder extends HandleableBuilder {
  constructor(streamHandlerBuilder, options={}) {
    this._streamHandlerBuilder = streamHandlerBuilder

    streamHandlerBuilder = safeBuilder(streamHandlerBuilder, options)

    var handleableBuilder = streamToHandleableBuilder(
      streamHandlerBuilder)

    super(handleableBuilder, options)
  }

  get streamHandlerBuilder() {
    return this._streamHandlerBuilder
  }

  loadStreamHandler(config, options) {
    return loadStreamHandler(config, this, options)
  }

  loadHandler(config, options) {
    return loadStreamHandler(config, this, options)
  }
}

export class StreamHandler extends StreamHandlerBuilder {
  constructor(streamHandler, options={}) {
    this._streamHandler = streamHandler
    
    streamHandler = safeHandler(streamHandler, options)

    var streamHandlerBuilder = config =>
      resolve(streamHandler)

    super(streamHandlerBuilder, options)
  }

  get streamHandler() {
    return this._streamHandler
  }
}
