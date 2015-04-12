import { resolve } from 'quiver-promise'

import { loadHttpHandler } from './util/loader'
import { safeBuilder, safeHandler } from './util/wrap'
import { HandleableBuilder } from './handleable-builder'

const _httpHandler = Symbol('_httpHandler')
const _httpHandlerBuilder = Symbol('_httpHandlerBuilder')

export class HttpHandlerBuilder extends HandleableBuilder {
  constructor(httpHandlerBuilder, options={}) {
    super(null, options)
    this[_httpHandlerBuilder] = httpHandlerBuilder
  }

  toMainHandleableBuilder() {
    const builder = this.toHttpHandlerBuilder()

    return config =>
      builder(config).then(httpHandler => ({ httpHandler }))
  }

  toHttpHandlerBuilder() {
    return safeBuilder(this[_httpHandlerBuilder])
  }

  get defaultLoader() {
    return loadHttpHandler
  }

  get componentType() {
    return 'HttpHandlerBuilder'
  }
}

export class HttpHandler extends HttpHandlerBuilder {
  constructor(httpHandler, options={}) {
    super(null, options)
    this[_httpHandler] = httpHandler
  }

  toHttpHandlerBuilder() {
    const handler = this.toHttpHandler()

    return config => resolve(handler)
  }

  toHttpHandler() {
    return safeHandler(this[_httpHandler])
  }

  get componentType() {
    return 'HttpHandler'
  }
}

export const httpHandlerBuilder = (builder, options) =>
  new HttpHandlerBuilder(builder, options)

export const httpHandler = (handler, options) =>
  new HttpHandler(handler, options)