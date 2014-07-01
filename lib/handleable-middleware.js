import { MiddlewareComponent } from './middleware.js'
import { mixinMiddlewareExtensible } from './extend-middleware.js'

export class HandleableMiddleware extends MiddlewareComponent {
  constructor(handleableMiddleware, options={}) {
    if(typeof(handleableMiddleware) != 'function') {
      throw new Error('handleable builder must be of type function')
    }

    this._handleableMiddleware = handleableMiddleware
    this._initMiddlewareExtension(options)

    super(options)
  }

  get rawHandleableMiddleware() {
    return this._handleableMiddleware
  }

  get handleableMiddleware() {
    var mainMiddleware = this._handleableMiddleware
    var extendMiddleware = this.extendMiddleware

    return combineMiddlewares([mainMiddleware, extendMiddleware])
  }
}

mixinMiddlewareExtensible(HandleableMiddleware)