import { HandleableBuilder } from './handleable-builder.js'
import { streamHandlerConvert } from 'quiver-handleable'
import { loadStreamHandler } from 'quiver-loader'

class StreamHandlerBuilder extends HandleableBuilder {
  constructor(streamHandlerBuilder) {
    this._streamHandlerBuilder = streamHandlerBuilder

    var handleableBuilder = config =>
      Promise.resolve(streamHandlerBuilder(config))
      .then(streamHandler => {
        return {
          get streamHandler() {
            return streamHandler
          }
        }
      })

    super(handleableBuilder)
  }

  get streamHandlerBuilder() {
    return this._streamHandlerBuilder
  }

  loadStreamHandler(config, options={}) {
    return loadStreamHandler(config, this, options)
  }

  loadHandler(config, options) {
    return loadStreamHandler(config, options)
  }
}

class StreamHandler extends StreamHandlerBuilder {
  constructor(options) {
    var { streamHandler } = options

    this._streamHandler = streamHandler

    options.streamHandlerBuilder = config =>
      Promise.resolve(streamHandler)

    super(options)
  }
}
