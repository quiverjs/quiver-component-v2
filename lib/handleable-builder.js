import { resolve } from 'quiver-promise'

import { safeHandler } from './util/wrap.js'
import { HandlerComponent } from './component.js'
import { mixinMiddlewareExtensible } from './extend-middleware.js'
import { combineBuilderWithMiddleware } from './util/middleware.js'

export class HandleableBuilder extends HandlerComponent {
  constructor(handleableBuilder, options={}) {
    this._rawHandleableBuilder = handleableBuilder
    this._handleableBuilder = safeHandler(handleableBuilder, options)

    this._initMiddlewareExtension(options)
    super(options)
  }

  get rawHandleableBuilder() {
    return this._rawHandleableBuilder
  }

  get handleableBuilder() {
    var builder = this._handleableBuilder
    var middleware = this.extendMiddleware

    return combineBuilderWithMiddleware(builder, middleware)
  }
}

mixinMiddlewareExtensible(HandleableBuilder)

export class Handleable extends HandleableBuilder {
  constructor(handleable, option={}) {
    var builder = config => resolve(handleable)
    options.safeWrapped = true

    super(builder, options)
  }
}