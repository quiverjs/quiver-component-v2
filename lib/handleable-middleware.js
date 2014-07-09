import { assertInstanceOf } from 'quiver-object'

import { safeHandler } from './util/wrap.js'
import { ExtensibleMiddleware } from './extensible-component.js'
import { combineMiddlewares } from './util/middleware.js'
import { mixinMiddlewareExtensible } from './extend-middleware.js'

export class HandleableMiddleware extends ExtensibleMiddleware {
  constructor(handleableMiddleware, options={}) {
    this._mainHandleableMiddleware = safeHandler(handleableMiddleware, options)

    this._initMiddlewareExtension(options)

    super(options)
  }

  get mainHandleableMiddleware() {
    return this._mainHandleableMiddleware
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