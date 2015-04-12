import { resolve } from 'quiver-promise'

import { loadStreamHandler } from './util/loader'
import { safeBuilder, safeHandler } from './util/wrap'
import { HandleableBuilder } from './handleable-builder'

const _streamHandler = Symbol('_streamHandler')
const _streamHandlerBuilder = Symbol('_streamHandlerBuilder')

export class StreamHandlerBuilder extends HandleableBuilder {
  constructor(streamHandlerBuilder, options={}) {
    super(null, options)
    this[_streamHandlerBuilder] = streamHandlerBuilder
  }

  toMainHandleableBuilder() {
    const builder = this.toStreamHandlerBuilder()

    return config =>
      builder(config).then(streamHandler => ({ streamHandler }))
  }

  toStreamHandlerBuilder() {
    return safeBuilder(this[_streamHandlerBuilder])
  }

  get defaultLoader() {
    return loadStreamHandler
  }

  get componentType() {
    return 'StreamHandlerBuilder'
  }
}

export class StreamHandler extends StreamHandlerBuilder {
  constructor(streamHandler, options={}) {
    super(null, options)
    this[_streamHandler] = streamHandler
  }

  toStreamHandlerBuilder() {
    const handler = this.toStreamHandler()

    return config => resolve(handler)
  }

  toStreamHandler() {
    return safeHandler(this[_streamHandler])
  }

  get componentType() {
    return 'StreamHandler'
  }
}

export const streamHandlerBuilder = (builder, options) =>
  new StreamHandlerBuilder(builder, options)

export const streamHandler = (handler, options) =>
  new StreamHandler(handler, options)