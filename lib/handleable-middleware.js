import { assertInstanceOf } from 'quiver-object'

import { safeHandler } from './util/wrap.js'
import { ExtensibleMiddleware } from './extensible-component.js'
import { combineMiddlewares, repeatOnceMiddleware } from './util/middleware.js'

export class HandleableMiddleware extends ExtensibleMiddleware {
  constructor(handleableMiddleware, options={}) {
    this._rawHandleableMiddleware = handleableMiddleware

    var middleware = safeHandler(
      handleableMiddleware, options)

    var { repeat } = options
    
    if(repeat == 'once') 
      middleware = repeatOnceMiddleware(this.id, middleware)

    this._mainHandleableMiddleware = middleware

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