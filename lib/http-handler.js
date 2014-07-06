import { resolve } from 'quiver-promise'

import { loadHttpHandler } from './util/loader.js'
import { safeBuilder, safeHandler } from './util/wrap.js'
import { HandleableBuilder } from './handleable-builder.js'

export class HttpHandlerBuilder extends HandleableBuilder {
  constructor(httpHandlerBuilder, options={}) {
    this._httpHandlerBuilder = httpHandlerBuilder

    httpHandlerBuilder = safeBuilder(httpHandlerBuilder, options)

    var handleableBuilder = config =>
      httpHandlerBuilder(config).then(httpHandler => ({ httpHandler }))

    super(handleableBuilder, options)
  }

  get httpHandlerBuilder() {
    return this._httpHandlerBuilder
  }

  loadHttpHandler(config, options) {
    return loadHttpHandler(config, this, options)
  }

  loadHandler(config, options) {
    return loadHttpHandler(config, this, options)
  }

  get type() {
    return 'http handler builder'
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

  get type() {
    return 'http handler'
  }
}
