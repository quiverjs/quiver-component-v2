import { StreamHandler, StreamHandlerBuilder } from './stream-handler.js'
import { simpleToStreamHandler, validateSimpleType } from 'quiver-simple-handler'
import { safePromised } from 'quiver-promise'

class SimpleHandlerBuilder extends StreamHandlerBuilder {
  constructor(simpleHandlerBuilder, options={}) {
    var { inputType, outputType } = options

    validateSimpleType(inputType)
    validateSimpleType(outputType)

    this._inputType = inputType
    this._outputType = outputType
    this._simpleHandlerBuilder = simpleHandlerBuilder

    var streamHandlerBuilder = config =>
      resolve(simpleHandlerBuilder(config))
      .then(simpleHandler =>
        simpleToStreamHandler(simpleHandler, inputType, outputType))

    super(streamHandlerBuilder, options)
  }
}

class SimpleHandler extends SimpleHandlerBuilder {
  constructor(simpleHandler, options={}) {
    if(typeof(simpleHandler) != 'function') {
      throw new TypeError('must construct with simple handler function')
    }

    this._simpleHandler = simpleHandler
    simpleHandler = safePromised(simpleHandler)

    var simpleHandlerBuilder = config =>
      resolve(simpleHandler)

    super(simpleHandlerBuilder, options)
  }
}
