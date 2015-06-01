import { copy } from 'quiver-object'
import { resolve } from 'quiver-promise'

import { StreamHandlerBuilder } from './stream-handler'
import { StreamFilter, HttpFilter } from './filter'
import { safeBuilder, safeHandler } from './util/wrap'

const _argsBuilder = Symbol('@argsBuilder')
const _argsHandler = Symbol('@argsHandler')
const _errorHandler = Symbol('@errorHandler')
const _errorBuilder = Symbol('@errorBuilder')

const argsToStreamFilter = argsHandler =>
  (config, handler) =>
    resolve((args, inputStreamable) =>
      argsHandler(args).then(newArgs=args =>
        handler(newArgs, inputStreamable)))

const errorToFilter = errorHandler =>
  (config, handler) =>
    resolve((...args) =>
      handler(...args).catch(err => 
        errorHandler(err)
        .then(result => {
          if(!result) throw err
          return result
        })))

const builderFilterConvert = (builder, filterConvert) =>
  (config, handler) =>
    builder(config).then(customHandler =>
      filterConvert(customHandler)(config, handler))

const applyArgsFilter = (argsHandler, handler) =>
  (args, inputStreamable) =>
    argsHandler(args).then((newArgs=args) => 
      handler(newArgs, inputStreamable))

const argsBuilderToFilter = argsBuilder =>
  (config, handler) =>
    argsBuilder(config).then(argsHandler =>
      applyArgsFilter(argsHandler, handler))

export class ArgsBuilderFilter extends StreamFilter {
  constructor(argsBuilder, options={}) {
    if(options.copyConfig === undefined) {
      options.copyConfig = true
    }

    super(null, options)

    this[_argsBuilder] = argsBuilder
  }

  toStreamFilter() {
    return argsBuilderToFilter(this.toArgsBuilder())
  }

  toArgsBuilder() {
    return safeBuilder(this[_argsBuilder])
  }

  get componentType() {
    return 'ArgsBuilderFilter'
  }
}

export class ArgsFilter extends ArgsBuilderFilter {
  constructor(argsHandler, options={}) {
    options.copyConfig = false

    super(null, options)
    this[_argsHandler] = argsHandler
  }

  toArgsBuilder() {
    const argsHandler = this.toArgsHandler()

    return config => resolve(argsHandler)
  }

  toArgsHandler() {
    return safeHandler(this[_argsHandler])
  }

  get componentType() {
    return 'ArgsFilter'
  }
}

export class ErrorFilter extends StreamFilter {
  constructor(errorHandler, options={}) {
    super(null, options)
    this[_errorHandler] = errorHandler
  }

  toStreamFilter() {
    return errorToFilter(this.toErrorHandler())
  }

  toErrorHandler() {
    return safeHandler(this[_errorHandler])
  }

  get componentType() {
    return 'ErrorFilter'
  }
}

export class ErrorBuilderFilter extends StreamFilter {
  constructor(errorBuilder, options={}) {
    super(null, options)
    this[_errorBuilder] = errorBuilder
  }

  toStreamFilter() {
    return builderFilterConvert(
      this.toErrorBuilder(), errorToFilter)
  }

  toErrorBuilder() {
    return safeBuilder(this[_errorBuilder])
  }

  get componentType() {
    return 'ErrorBuilderFilter'
  }
}

export const filterArgs = function(argsHandler) {
  return this.middleware(new ArgsFilter(argsHandler))
}

export const argsFilter = (handler, options) =>
  new ArgsFilter(handler, options)

export const argsBuilderFilter = (builder, options) =>
  new ArgsBuilderFilter(builder, options)

export const errorFilter = (handler, options) =>
  new ErrorFilter(handler, options)

export const errorBuilderFilter = (builder, options) =>
  new ErrorBuilderFilter(builder, options)
