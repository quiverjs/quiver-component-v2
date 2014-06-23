import { HandleableBuilder } from './handleable-builder.js'

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
}

class StreamHandler extends StreamHandlerBuilder {
  constructor(streamHandler) {
    this._streamHandler = streamHandler

    var streamHandlerBuilder = config =>
      Promise.resolve(streamHandler)

    super(streamHandlerBuilder)
  }
}
