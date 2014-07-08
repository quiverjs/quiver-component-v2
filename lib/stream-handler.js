import { resolve } from 'quiver-promise'

import { loadStreamHandler } from './util/loader.js'
import { safeBuilder, safeHandler } from './util/wrap.js'
import { HandleableBuilder } from './handleable-builder.js'

export class StreamHandlerBuilder extends HandleableBuilder {
  constructor(streamHandlerBuilder, options={}) {
    this._streamHandlerBuilder = streamHandlerBuilder

    streamHandlerBuilder = safeBuilder(streamHandlerBuilder, options)

    var handleableBuilder = config =>
      streamHandlerBuilder(config).then(streamHandler => ({ streamHandler }))

    super(handleableBuilder, options)
  }

  get streamHandlerBuilder() {
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
    this._streamHandler = streamHandler
    
    streamHandler = safeHandler(streamHandler, options)

    var streamHandlerBuilder = config =>
      resolve(streamHandler)

    super(streamHandlerBuilder, options)
  }

  get streamHandler() {
    return this._streamHandler
  }

  get type() {
    return 'stream handler'
  }
}
