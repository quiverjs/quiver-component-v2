import { HandleableMiddleware } from './handleable-middleware.js'
import { resolve } from 'quiver-promise'

export class HandleableFilter extends HandleableMiddleware {
  constructor(handleableFilter) {
    this._handleableFilter = handleableFilter

    var middleware = (config, builder) =>
      builder(config).then(handleable =>
        Promise.resolve(handleableFilter(config, handleable)))

    super(middleware)
  }
}

export class StreamFilter extends HandleableFilter {
  constructor(streamFilter) {
    this._streamFilter = streamFilter

    var handleableFilter = (config, handleable) =>
      streamFilter(config, handleable.streamHandler)

    super(handleableFilter)
  }
}

export class HttpFilter extends HandleableFilter {
  constructor(httpFilter) {
    this._httpFilter = httpFilter

    var handleableFilter = (config, handleable) =>
      httpFilter(config, handleable.httpHandler)

    super(handleableFilter)
  }
}

var argsToStreamFilter = argsFilter =>
  (config, handler) =>
    (args, inputStreamable) =>
      resolve(argsFilter(args)).then(newArgs =>
        handler(args, inputStreamable))

export class ArgsFilter extends StreamFilter {
  constructor(argsFilter) {
    this._argsFilter = argsFilter

    constructor(argsToStreamFilter(argsFilter))
  }
}

var errorToStreamFilter = errorFilter =>
  (config, handler) =>
    (args, inputStreamable) =>
      handler(args, inputStreamable).catch(errorFilter)

export class ErrorFilter extends StreamFilter {
  constructor(errorFilter) {
    this._errorFilter = errorFilter

    var streamFilter = (config, handler) =>
    return errorToStreamFilter
  }
}
