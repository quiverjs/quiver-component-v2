import { resolve } from 'quiver-promise'

import { loadHandleable } from './util/loader.js'
import { HandlerComponent } from './handler.js'
import { mixinMiddlewareExtensible } from './extend-middleware.js'
import { combineBuilderWithMiddleware } from './util/middleware.js'

export class HandleableBuilder extends HandlerComponent {
  constructor(handleableBuilder, options) {
    if(typeof(handleableBuilder) != 'function') {
      throw new Error('handleable builder must be of type function')
    }

    this._handleableBuilder = handleableBuilder

    this._initMiddlewareExtension(options)
    super(options)
  }

  get rawHandleableBuilder() {
    return this._handleableBuilder
  }

  get handleableBuilder() {
    var builder = this._handleableBuilder
    var middleware = this.extendMiddleware

    return combineBuilderWithMiddleware(builder, middleware)
  }

  loadHandleable(config, options) {
    return loadHandleable(config, this, this.handleableBuilder, options)
  }

  loadHandler(config, options) {
    return loadHandleable(config, options)
  }
}

mixinMiddlewareExtensible(HandleableBuilder)

export class Handleable extends HandleableBuilder {
  constructor(handleable, options) {
    var builder = config => resolve(handleable)

    super(builder, options)
  }
}