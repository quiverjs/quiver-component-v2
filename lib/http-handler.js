import { HandleableBuilder } from './handleable-builder.js'

class HttpHandlerBuilder extends HandleableBuilder {
  constructor(httpHandlerBuilder) {
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

    super(handleableBuilder)
  }

  get httpHandlerBuilder() {
    return this._httpHandlerBuilder
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
