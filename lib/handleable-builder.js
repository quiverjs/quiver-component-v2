import { resolve } from 'quiver-promise'
import { assertInstanceOf } from 'quiver-object'

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

  replaceWith(replaceComponent) {
    assertInstanceOf(replaceComponent, HandlerComponent,
      'replacement must be another handler component')

    this._replaceComponent = replaceComponent
    return this
  }

  get rawHandleableBuilder() {
    return this._rawHandleableBuilder
  }

  get handleableBuilder() {
    if(this._replaceComponent) 
      return this._replaceComponent.handleableBuilder

    var builder = this._handleableBuilder
    var middleware = this.extendMiddleware

    return combineBuilderWithMiddleware(builder, middleware)
  }

  get type() {
    return 'handleable builder'
  }

  toJson() {
    var json = super.toJson()
    json.middlewares = this.middlewareJson()
    return json
  }
}

mixinMiddlewareExtensible(HandleableBuilder)

export class Handleable extends HandleableBuilder {
  constructor(handleable, options={}) {
    var builder = config => resolve(handleable)

    options.safeWrapped = true
    super(builder, options)
  }

  get type() {
    return 'handleable'
  }
}