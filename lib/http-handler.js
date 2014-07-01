import { resolve } from 'quiver-promise'

import { loadHttpHandler } from './util/loader.js'
import { HandleableBuilder } from './handleable-builder.js'

export var httpToHandleableBuilder = httpBuilder =>
  config => 
    resolve(httpBuilder(config))
    .then(httpHandler => ({
      get httpHandler() {
        return httpHandler
      }
    }))

export class HttpHandlerBuilder extends HandleableBuilder {
  constructor(httpHandlerBuilder) {
    this._httpHandlerBuilder = httpHandlerBuilder

    var handleableBuilder = httpToHandleableBuilder(
      httpHandlerBuilder)

    super(handleableBuilder)
  }

  get httpHandlerBuilder() {
    return this._httpHandlerBuilder
  }

  loadHttpHandler(config, options={}) {
    return loadHttpHandler(config, this, options)
  }

  loadHandler(config, options) {
    return loadHttpHandler(config, options)
  }
}

export class HttpHandler extends HttpHandlerBuilder {
  constructor(httpHandler, options) {
    this._httpHandler = httpHandler

    var httpHandlerBuilder = config =>
      resolve(httpHandler)

    super(httpHandlerBuilder, options)
  }

  get httpHandler() {
    return this._httpHandler
  }
}
