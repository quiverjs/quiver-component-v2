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

// TODO: Make args handleable filter
export class ArgsFilter extends StreamFilter {
  constructor(argsHandler, options) {
    this._argsHandler = argsHandler

    var streamFilter = argsToStreamFilter(argsHandler)
    super(streamFilter, options)
  }
}

export class ArgsBuilderFilter extends StreamFilter {
  constructor(argsBuilder, options) {
    this._argsBuilder = argsBuilder

    var streamFilter = builderFilterConvert(
      argsBuilder, argsToStreamFilter)

    super(streamFilter, options)
  }
}

export class ErrorFilter extends StreamFilter {
  constructor(errorHandler, options) {
    this._errorHandler = errorHandler

    var streamFilter = errorToFilter(errorHandler)

    super(streamFilter, options)
  }
}

export class ErrorBuilderFilter extends StreamFilter {
  constructor(errorBuilder, options) {
    this._errorBuilder = errorBuilder

    var streamFilter = builderFilterConvert(
      errorBuilder, errorToFilter)

    super(streamFilter, options)
  }
}

export class ErrorHttpFilter extends HttpFilter {
  constructor(errorHandler, options) {
    this._errorHandler = errorHandler

    var HttpFilter = errorToFilter(errorHandler)

    super(HttpFilter, options)
  }
}

export class ErrorBuilderHtttpFilter extends HttpFilter {
  constructor(errorBuilder, options) {
    this._errorBuilder = errorBuilder

    var httpFilter = builderFilterConvert(
      errorBuilder, errorToFilter)

    super(httpFilter, options)
  }
}
