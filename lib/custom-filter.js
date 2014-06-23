import { StreamFilter } from './filter.js'
import { copy } from 'quiver-object'
import { safePromised } from 'quiver-promise'

var argsToStreamFilter = argsHandler =>
  (config, handler) =>
    (args, inputStreamable) =>
      resolve(argsHandler(args)).then(newArgs =>
        handler(args, inputStreamable))

var errorToFilter = errorHandler =>
  (config, handler) =>
    (...args) =>
      handler(...args).catch(errorHandler)

var builderFilterConvert = (builder, filterConvert) =>
  (config, handler) =>
    builder(copy(config)).then(customHandler =>
      filterConvert(customHandler)(config, handler))

var argsHandlerKeys = [
  'streamHandler',
  'cacheIdHandler'
]

export class ArgsFilter extends StreamFilter {
  constructor(argsHandler, options) {
    this._argsHandler = argsHandler

    if(!options.applyToHandlers) {
      options.applyToHandlers = argsHandlerKeys
    }

    var streamFilter = argsToStreamFilter(argsHandler)
    super(streamFilter, options)
  }
}

export class ArgsBuilderFilter extends StreamFilter {
  constructor(argsBuilder, options) {
    this._argsBuilder = argsBuilder

    if(!options.applyToHandlers) {
      options.applyToHandlers = argsHandlerKeys
    }
    
    var streamFilter = builderFilterConvert(
      argsBuilder, argsToStreamFilter)

    super(streamFilter, options)
  }
}

var createErrorFilterClass = ParentClass =>
  class ErrorFilter extends ParentClass {
    constructor(errorHandler, options) {
      this._errorHandler = errorHandler

      var streamFilter = errorToFilter(errorHandler)

      super(streamFilter, options)
    }
  }

var createErrorBuilderFilterClass = ParentClass =>
  class ErrorBuilderFilter extends ParentClass {
    constructor(errorBuilder, options) {
      this._errorBuilder = errorBuilder

      var streamFilter = builderFilterConvert(
        errorBuilder, errorToFilter)

      super(streamFilter, options)
    }
  }

export var ErrorFilter = createErrorFilterClass(StreamFilter)
export var ErrorBuilderFilter = createErrorBuilderFilterClass(StreamFilter)

export var ErrorHttpFilter = createErrorFilterClass(HttpFilter)
export var ErrorBuilderHttpFilter = createErrorBuilderFilterClass(HttpFilter)
