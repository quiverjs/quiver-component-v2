import { assertInstanceOf } from 'quiver-object'

import { safeHandler } from './util/wrap.js'
import { ExtensibleMiddleware } from './extensible-component.js'
import { combineMiddlewares } from './util/middleware.js'

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
}

export var handleableMiddleware = (middleware, options) =>
  new HandleableMiddleware(middleware, options)