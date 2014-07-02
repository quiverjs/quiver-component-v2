import { resolve } from 'quiver-promise'

import { loadHttpHandler } from './util/loader.js'
import { safeBuilder, safeHandler } from './util/wrap.js'
import { HandleableBuilder } from './handleable-builder.js'

var httpToHandleableBuilder = httpBuilder =>
  config => resolve(httpBuilder(config))
  .then(httpHandler => ({
    get httpHandler() {
      return httpHandler
    }
  }))

export class HttpHandlerBuilder extends HandleableBuilder {
  constructor(httpHandlerBuilder, options={}) {
    this._httpHandlerBuilder = httpHandlerBuilder

    httpHandlerBuilder = safeBuilder(httpHandlerBuilder, options)

    var handleableBuilder = httpToHandleableBuilder(
      httpHandlerBuilder)

    super(handleableBuilder, options)
  }

  get httpHandlerBuilder() {
    return this._httpHandlerBuilder
  }

  loadHttpHandler(config, options) {
    return loadHttpHandler(config, this, 
      this.handleableBuilder, options)
  }

  loadHandler(config, options) {
    return this.loadHttpHandler(config, options)
  }
}

export class HttpHandler extends HttpHandlerBuilder {
  constructor(httpHandler, options={}) {
    this._httpHandler = httpHandler

    httpHandler = safeHandler(httpHandler, options)

    var httpHandlerBuilder = config =>
      resolve(httpHandler)

    super(httpHandlerBuilder, options)
  }

  get httpHandler() {
    return this._httpHandler
  }
}
