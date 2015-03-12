import { safeHandler } from './util/wrap'
import { ExtensibleMiddleware } from './extensible-component'
import { combineMiddlewares } from './util/middleware'

export class HandleableMiddleware extends ExtensibleMiddleware {
  constructor(handleableMiddleware, options={}) {
    handleableMiddleware = safeHandler(
      handleableMiddleware, options)
    
    super(options)

    this._handleableMiddleware = handleableMiddleware
  }

  toMainHandleableMiddleware() {
    let middleware = this._handleableMiddleware

    if(!middleware) throw new Error(
      'mainHandleableMiddleware is not defined')

    return middleware
  }

  get type() {
    return 'Handleable Middleware'
  }
}

export let handleableMiddleware = (middleware, options) =>
  new HandleableMiddleware(middleware, options)