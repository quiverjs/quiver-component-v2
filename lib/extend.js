import { assertInstanceOf } from 'quiver-object'
import { HandlerComponent } from './component.js'
import { mixinMiddlewareExtensible } from './extend-middleware.js'
import { combineBuilderWithMiddleware, combineMiddlewares } from './util/middleware.js'

export class ExtendHandler extends HandlerComponent {
  constructor(handlerComponent, options={}) {
    assertInstanceOf(handlerComponent, HandlerComponent,
      'must extend from another handler component')

    this._initMiddlewareExtension(options)
    this._parentHandler = handlerComponent

    super(options)
  }

  get handleableBuilder() {
    var builder = this._parentHandler.handleableBuilder
    var middleware = this.extendMiddleware
    return combineBuilderWithMiddleware(builder, middleware)
  }

  get parentHandler() {
    return this._parentHandler
  }
}
mixinMiddlewareExtensible(ExtendHandler)

export class ExtendMiddleware extends MiddlewareComponent {
  constructor(middlewareComponent, options={}) {
    assertInstanceOf(middlewareComponent, MiddlewareComponent,
      'must extend from another middleware component')

    this._initMiddlewareExtension(options)
    this._parentMiddleware = middlewareComponent

    super(options)
  }

  get handleableMiddleware() {
    var mainMiddleware = this._parentMiddleware.handleableMiddleware
    var extendMiddleware = this.extendMiddleware
    return combineMiddlewares([mainMiddleware, extendMiddleware])
  }

  get parentHandler() {
    return this._parentHandler
  }
}
mixinMiddlewareExtensible(ExtendMiddleware)