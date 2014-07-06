import { copy } from 'quiver-object'
import { resolve } from 'quiver-promise'

import { StreamFilter, HttpFilter, HandleableFilter } from './filter.js'
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

var applyArgsFilter = (argsHandler, handler) =>
  (args, inputStreamable) =>
    argsHandler(args).then(args => 
      handler(args, inputStreamable))

var argsBuilderToFilter = argsBuilder =>
  (config, handleable) => {
    var { streamHandler, meta: metaHandlers } = handleable
    if(!streamHandler && !metaHandlers) return resolve(handleable)

    return argsBuilder(config).then(argsHandler => {
      if(streamHandler) {
        handleable.streamHandler = applyArgsFilter(
          argsHandler, streamHandler)
      }

      if(metaHandlers) {
        for(var key in metaHandlers) {
          metaHandlers[key] = applyArgsFilter(
            argsHandler, metaHandlers[key])
        }
      }
      
      return handleable
    })
  }

export class ArgsBuilderFilter extends HandleableFilter {
  constructor(argsBuilder, options={}) {
    this._argsBuilder = argsBuilder
    argsBuilder = safeBuilder(argsBuilder, options)

    var filter = argsBuilderToFilter(argsBuilder)

    super(filter, options)
  }

  get argsBuilder() {
    return this._argsBuilder
  }

  get type() {
    return 'args builder filter'
  }
}

export class ArgsFilter extends ArgsBuilderFilter {
  constructor(argsHandler, options={}) {
    this._argsHandler = argsHandler
    argsHandler = safeHandler(argsHandler, options)

    var argsBuilder = config => resolve(argsHandler)
    super(argsBuilder, options)
  }

  get argsFilter() {
    return this._argsFilter
  }

  get type() {
    return 'args filter'
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