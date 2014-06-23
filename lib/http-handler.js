import { HandleableBuilder } from './handleable-builder.js'
import { loadHttpHandler } from 'quiver-loader'

class HttpHandlerBuilder extends HandleableBuilder {
  constructor(httpHandlerBuilder, options) {
    this._httpHandlerBuilder = httpHandlerBuilder

    var handleableBuilder = config =>
      Promise.resolve(httpHandlerBuilder(config))
      .then(httpHandler => {
        return {
          get httpHandler() {
            return httpHandler
          }
        }
      })

    super(handleableBuilder, options)
  }

  get httpHandlerBuilder() {
    return this._httpHandlerBuilder
  }

  loadHandler(config, options) {
    return loadHttpHandler(config, this, options)
  }
}

class HttpHandler extends HttpHandlerBuilder {
  constructor(httpHandler) {
    this._httpHandler = httpHandler

    var httpHandlerBuilder = config =>
      Promise.resolve(httpHandler)

    super(httpHandlerBuilder)
  }

  get httpHandler() {
    return this._httpHandler
  }
}
