import { copy } from 'quiver-object'
import { resolve } from 'quiver-promise'

import { StreamFilter, HttpFilter } from './filter.js'
import { safeBuilder, safeHandler } from './util/wrap.js'

var argsToStreamFilter = argsHandler =>
  (config, handler) =>
    resolve((args, inputStreamable) =>
      argsHandler(args).then(newArgs =>
        handler(newArgs, inputStreamable)))

var errorToFilter = errorHandler =>
  (config, handler) =>
    resolve((...args) =>
      handler(...args).catch(errorHandler))

var builderFilterConvert = (builder, filterConvert) =>
  (config, handler) =>
    builder(copy(config)).then(customHandler =>
      filterConvert(customHandler)(config, handler))

var argsHandlerKeys = [
  'streamHandler',
  'cacheIdHandler'
]

export class ArgsFilter extends StreamFilter {
  constructor(argsHandler, options={}) {
    this._argsHandler = argsHandler

    if(!options.applyToHandlers)
      options.applyToHandlers = argsHandlerKeys

    this._argsFilter = argsHandler
    argsHandler = safeHandler(argsHandler, options)

    var streamFilter = argsToStreamFilter(argsHandler)
    super(streamFilter, options)
  }

  get argsFilter() {
    return this._argsFilter
  }

  get type() {
    return 'args filter'
  }
}

export class ArgsBuilderFilter extends StreamFilter {
  constructor(argsBuilder, options={}) {
    this._argsBuilder = argsBuilder

    if(!options.applyToHandlers)
      options.applyToHandlers = argsHandlerKeys
    
    this._argsBuilder = argsBuilder
    argsBuilder = safeBuilder(argsBuilder, options)

    var streamFilter = builderFilterConvert(
      argsBuilder, argsToStreamFilter)

    super(streamFilter, options)
  }

  get type() {
    return 'args builder filter'
  }
}

var createErrorFilterClass = ParentClass =>
  class ErrorFilter extends ParentClass {
    constructor(errorHandler, options={}) {
      this._errorFilter = errorHandler
      errorHandler = safeHandler(errorHandler, options)

      var streamFilter = errorToFilter(errorHandler)

      super(streamFilter, options)
    }

    get errorFilter() {
      return this._errorFilter
    }

    get type() {
      return 'error filter'
    }
  }

var createErrorBuilderFilterClass = ParentClass =>
  class ErrorBuilderFilter extends ParentClass {
    constructor(errorBuilder, options={}) {
      this._errorBuilder = errorBuilder
      errorBuilder = safeBuilder(errorBuilder, options)

      var streamFilter = builderFilterConvert(
        errorBuilder, errorToFilter)

      super(streamFilter, options)
    }

    get errorBuilder () {
      return this._errorBuilder
    }

    get type() {
      return 'error builder filter'
    }
  }

export var ErrorFilter = createErrorFilterClass(StreamFilter)
export var ErrorBuilderFilter = createErrorBuilderFilterClass(StreamFilter)

export var ErrorHttpFilter = createErrorFilterClass(HttpFilter)
export var ErrorBuilderHttpFilter = createErrorBuilderFilterClass(HttpFilter)