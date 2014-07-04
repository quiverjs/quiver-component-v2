import { assertInstanceOf } from 'quiver-object'

import { safeHandler } from './util/wrap.js'
import { MiddlewareComponent } from './component.js'
import { combineMiddlewares } from './util/middleware.js'
import { mixinMiddlewareExtensible } from './extend-middleware.js'

export class HandleableMiddleware extends MiddlewareComponent {
  constructor(handleableMiddleware, options={}) {
    this._rawHandleableMiddleware = handleableMiddleware
    this._handleableMiddleware = safeHandler(handleableMiddleware, options)

    this._initMiddlewareExtension(options)

    super(options)
  }

  replaceWith(replaceComponent) {
    assertInstanceOf(replaceComponent, MiddlewareComponent,
      'replacement must be another middleware component')

    this._replaceComponent = replaceComponent
    return this
  }

  get rawHandleableMiddleware() {
    return this._rawHandleableMiddleware
  }

  get handleableMiddleware() {
    if(this._replaceComponent)
      return this._replaceComponent.handleableMiddleware

    var mainMiddleware = this._handleableMiddleware
    var extendMiddleware = this.extendMiddleware

    return combineMiddlewares([mainMiddleware, extendMiddleware])
  }

  get type() {
    return 'handleable middleware'
  }

  toJson() {
    var json = super.toJson()
    json.middlewares = this.middlewareJson()
    return json
  }
}

mixinMiddlewareExtensible(HandleableMiddleware)