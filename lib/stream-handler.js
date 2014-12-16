import { resolve } from 'quiver-promise'

import { loadStreamHandler } from './util/loader'
import { safeBuilder, safeHandler } from './util/wrap'
import { HandleableBuilder } from './handleable-builder'

export class StreamHandlerBuilder extends HandleableBuilder {
  constructor(streamHandlerBuilder, options={}) {
    this._streamHandlerBuilder = safeBuilder(
      streamHandlerBuilder, options)

    super(null, options)
  }

  toMainHandleableBuilder() {
    var builder = this.toStreamHandlerBuilder()

    return config =>
      builder(config).then(streamHandler => ({ streamHandler }))
  }

  toStreamHandlerBuilder() {
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

  toStreamHandlerBuilder() {
    var handler = this.toStreamHandler()

    return config => resolve(handler)
  }

  toStreamHandler() {
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