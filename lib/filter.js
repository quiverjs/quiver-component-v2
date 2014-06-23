import { HandleableMiddleware } from './handleable-middleware.js'
import { resolve } from 'quiver-promise'

export class HandleableFilter extends HandleableMiddleware {
  constructor(handleableFilter, options) {
    this._handleableFilter = handleableFilter

    var middleware = (config, builder) =>
      builder(config).then(handleable =>
        Promise.resolve(handleableFilter(config, handleable)))

    super(middleware, options)
  }
}

export class StreamFilter extends HandleableFilter {
  constructor(streamFilter, options) {
    this._streamFilter = streamFilter

    var handleableFilter = (config, handleable) =>
      streamFilter(config, handleable.streamHandler)

    super(handleableFilter, options)
  }
}

export class HttpFilter extends HandleableFilter {
  constructor(httpFilter, options) {
    this._httpFilter = httpFilter

    var handleableFilter = (config, handleable) =>
      httpFilter(config, handleable.httpHandler)

    super(handleableFilter, options)
  }
}
