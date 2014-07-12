import { resolve } from 'quiver-promise'

import { loadStreamHandler } from './util/loader.js'
import { safeBuilder, safeHandler } from './util/wrap.js'
import { HandleableBuilder } from './handleable-builder.js'

export class StreamHandlerBuilder extends HandleableBuilder {
  constructor(streamHandlerBuilder, options={}) {
    this._streamHandlerBuilder = safeBuilder(
      streamHandlerBuilder, options)

    super(null, options)
  }

  get mainHandleableBuilder() {
    var builder = this.streamHandlerBuilder

    return config =>
      builder(config).then(streamHandler => ({ streamHandler }))
  }

  get streamHandlerBuilder() {
    if(!this._streamHandlerBuilder) throw new Error(
      'streamHandlerBuilder is not defined')

    return this._streamHandlerBuilder
  }

  get handlerLoader() {
    return loadStreamHandler
  }

  get type() {
    return 'stream handler builder'
  }
}

export class StreamHandler extends StreamHandlerBuilder {
  constructor(streamHandler, options={}) {
    this._streamHandler = safeHandler(streamHandler, options)

    super(null, options)
  }

  get streamHandlerBuilder() {
    var handler = this.streamHandler

    return config => resolve(handler)
  }

  get streamHandler() {
    if(!this._streamHandler) throw new Error(
      'streamHandler is not defined')

    return this._streamHandler
  }

  get type() {
    return 'stream handler'
  }
}

export var streamHandlerBuilder = (builder, options) =>
  new StreamHandlerBuilder(builder, options)

export var streamHandler = (handler, options) =>
  new StreamHandler(handler, options)