import { StreamHandler, StreamHandlerBuilder } from './stream-handler.js'
import { simpleToStreamHandler, validateSimpleType } from 'quiver-simple-handler'

class SimpleHandler extends StreamHandler {
  constructor(simpleHandler, inputType, outputType) {
    this._inputType = inputType
    this._outputType = outputType
    this._simpleHandler = simpleHandler

    var streamHandler = simpleToStreamHandler(simpleHandler, inputType, outputType)

    super(streamHandler)
  }
}

class SimpleHandlerBuilder extends StreamHandlerBuilder {
  constructor(simpleHandlerBuilder, inputType, outputType) {
    validateSimpleType(inputType)
    validateSimpleType(outputType)

    this._inputType = inputType
    this._outputType = outputType
    this._simpleHandlerBuilder = simpleHandlerBuilder

    var streamHandlerBuilder = config =>
      Promise.resolve(simpleHandlerBuilder(config))
      .then(simpleHandler =>
        simpleToStreamHandler(simpleHandler, inputType, outputType))

    super(streamHandlerBuilder)
  }
}
