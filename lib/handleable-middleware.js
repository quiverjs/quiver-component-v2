import { safeHandler } from './util/wrap'
import { ExtensibleMiddleware } from './extensible-component'
import { combineMiddlewares, repeatOnceMiddleware } from './util/middleware'

export class HandleableMiddleware extends ExtensibleMiddleware {
  constructor(handleableMiddleware, options={}) {
    this._mainMiddleware = safeHandler(
      handleableMiddleware, options)

    this._repeat = options.repeat
    
    super(options)
  }

  get mainHandleableMiddleware() {
    var middleware = this.mainMiddleware

    if(this._repeat == 'once') 
      middleware = repeatOnceMiddleware(this.id, middleware)

    return middleware
  }

  get mainMiddleware() {
    var middleware = this._mainHandleableMiddleware

    if(!middleware) throw new Error(
      'mainHandleableMiddleware is not defined')

    return middleware
  }

  get type() {
    return 'Handleable Middleware'
  }
}

export var handleableMiddleware = (middleware, options) =>
  new HandleableMiddleware(middleware, options)