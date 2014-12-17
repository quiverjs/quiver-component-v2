import { resolve } from 'quiver-promise'

import { loadHttpHandler } from './util/loader'
import { safeBuilder, safeHandler } from './util/wrap'
import { HandleableBuilder } from './handleable-builder'

export class HttpHandlerBuilder extends HandleableBuilder {
  constructor(httpHandlerBuilder, options={}) {
    this._httpHandlerBuilder = safeBuilder(
      httpHandlerBuilder, options)

    super(null, options)
  }

  toMainHandleableBuilder() {
    var builder = this.toHttpHandlerBuilder()

    return config =>
      builder(config).then(httpHandler => ({ httpHandler }))
  }

  toHttpHandlerBuilder() {
    if(!this._httpHandlerBuilder) throw new Error(
      'httpHandlerBuilder is not defined')

    return this._httpHandlerBuilder
  }

  get defaultLoader() {
    return loadHttpHandler
  }

  get type() {
    return 'Http Handler Builder'
  }
}

export class HttpHandler extends HttpHandlerBuilder {
  constructor(httpHandler, options={}) {
    this._httpHandler = safeHandler(httpHandler, options)

    super(null, options)
  }

  toHttpHandlerBuilder() {
    var handler = this.toHttpHandler()

    return config => resolve(handler)
  }

  toHttpHandler() {
    if(!this._httpHandler) throw new Error(
      'httpHandler is not defined')

    return this._httpHandler
  }

  get type() {
    return 'Http Handler'
  }
}

export var httpHandlerBuilder = (builder, options) =>
  new HttpHandlerBuilder(builder, options)

export var httpHandler = (handler, options) =>
  new HttpHandler(handler, options)