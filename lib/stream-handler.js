import { resolve } from 'quiver-promise'

import { loadStreamHandler } from './util/loader.js'
import { HandleableBuilder } from './handleable-builder.js'

var streamToHandleableBuilder = streamBuilder =>
  config => resolve(streamBuilder(config))
  .then(streamHandler => ({
    get streamHandler() {
      return streamHandler
    }
  }))

export class StreamHandlerBuilder extends HandleableBuilder {
  constructor(streamHandlerBuilder) {
    this._streamHandlerBuilder = streamHandlerBuilder

    var handleableBuilder = streamToHandleableBuilder(
      streamHandlerBuilder)

    super(handleableBuilder)
  }

  get streamHandlerBuilder() {
    return this._streamHandlerBuilder
  }

  loadStreamHandler(config, options) {
    return loadStreamHandler(config, this, 
      this.handleableBuilder, options)
  }

  loadHandler(config, options) {
    return this.loadStreamHandler(config, options)
  }
}

export class StreamHandler extends StreamHandlerBuilder {
  constructor(streamHandler, options) {
    this._streamHandler = streamHandler

    var streamHandlerBuilder = config =>
      resolve(streamHandler)

    super(streamHandlerBuilder, options)
  }

  get streamHandler() {
    return this._streamHandler
  }
}
