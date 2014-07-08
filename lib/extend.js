import { assertInstanceOf } from 'quiver-object'
import { HandlerComponent, MiddlewareComponent } from './component.js'
import { mixinMiddlewareExtensible } from './extend-middleware.js'
import { combineBuilderWithMiddleware, combineMiddlewares } from './util/middleware.js'

export class ExtendedHandler extends HandlerComponent {
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

  get type() {
    return 'extend handler'
  }

  toJson() {
    var json = super.toJson()
    
    json.parentHandler = this.parentHandler.toJson()

    return json
  }
}
mixinMiddlewareExtensible(ExtendedHandler)

export class ExtendedMiddleware extends MiddlewareComponent {
  constructor(middlewareComponent, options={}) {
    assertInstanceOf(middlewareComponent, MiddlewareComponent,
      'must extend from another middleware component')

    this._initMiddlewareExtension(options)
    this._parentMiddleware = middlewareComponent

    super(options)
  }

  get handleableMiddleware() {
    var mainMiddleware = this.parentMiddleware
      .handleableMiddleware

    var extendMiddleware = this.extendMiddleware

    return combineMiddlewares([mainMiddleware, extendMiddleware])
  }

  get parentMiddleware() {
    return this._parentMiddleware
  }

  get type() {
    return 'extend middleware'
  }

  toJson() {
    var json = super.toJson()
    
    json.parentMiddleware = this.parentMiddleware.toJson()

    return json
  }
}
mixinMiddlewareExtensible(ExtendedMiddleware)