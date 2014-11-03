import { copy } from 'quiver-object'
import { resolve } from 'quiver-promise'

import { StreamFilter, HttpFilter, HandleableFilter } from './filter'
import { safeBuilder, safeHandler } from './util/wrap'

var argsToStreamFilter = argsHandler =>
  (config, handler) =>
    resolve((args, inputStreamable) =>
      argsHandler(args).then(newArgs=args =>
        handler(newArgs, inputStreamable)))

var errorToFilter = errorHandler =>
  (config, handler) =>
    resolve((...args) =>
      handler(...args).catch(err => 
        errorHandler(err)
        .then(result => {
          if(!result) throw err
          return result
        })))

var builderFilterConvert = (builder, filterConvert) =>
  (config, handler) =>
    builder(config).then(customHandler =>
      filterConvert(customHandler)(config, handler))

var applyArgsFilter = (argsHandler, handler) =>
  (args, inputStreamable) =>
    argsHandler(args).then((newArgs=args) => 
      handler(newArgs, inputStreamable))

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
    this._argsBuilder = safeBuilder(argsBuilder, options)
    
    if(options.copyConfig === undefined)
      options.copyConfig = true

    super(null, options)
  }

  get handleableFilter() {
    return argsBuilderToFilter(this.argsBuilder)
  }

  get argsBuilder() {
    if(!this._argsBuilder) throw new Error(
      'argsBuilder is not defined')

    return this._argsBuilder
  }

  get type() {
    return 'args builder filter'
  }
}

export class ArgsFilter extends ArgsBuilderFilter {
  constructor(argsHandler, options={}) {
    this._argsHandler = safeHandler(argsHandler, options)
    options.copyConfig = false

    super(null, options)
  }

  get argsBuilder() {
    var argsHandler = this.argsHandler

    return config => resolve(argsHandler)
  }

  get argsHandler() {
    if(!this._argsHandler) throw new Error(
      'argsHandler is not defined')

    return this._argsHandler
  }

  get type() {
    return 'args filter'
  }
}

export class ErrorFilter extends StreamFilter {
  constructor(errorHandler, options={}) {
    this._errorHandler = safeHandler(errorHandler, options)

    super(null, options)
  }

  get streamFilter() {
    return errorToFilter(this.errorHandler)
  }

  get errorHandler() {
    if(!this._errorHandler) throw new Error(
      'errorHandler is not defined')

    return this._errorHandler
  }

  get type() {
    return 'error filter'
  }
}

export class ErrorBuilderFilter extends StreamFilter {
  constructor(errorBuilder, options={}) {
    this._errorBuilder = safeBuilder(errorBuilder, options)

    super(null, options)
  }

  get streamFilter() {
    return builderFilterConvert(
      this.errorBuilder, errorToFilter)
  }

  get errorBuilder () {
    if(!this._errorBuilder) throw new Error(
      'errorBuilder is not defined')

    return this._errorBuilder
  }

  get type() {
    return 'error builder filter'
  }
}

export var argsFilter = (handler, options) =>
  new ArgsFilter(handler, options)

export var argsBuilderFilter = (builder, options) =>
  new ArgsBuilderFilter(builder, options)

export var errorFilter = (handler, options) =>
  new ErrorFilter(handler, options)

export var errorBuilderFilter = (builder, options) =>
  new ErrorBuilderFilter(builder, options)