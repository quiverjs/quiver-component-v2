import { safeHandler } from './util/wrap'
import { ExtensibleMiddleware } from './extensible-component'
import { combineMiddlewares } from './util/middleware'

const _handleableMiddleware = Symbol('_handleableMiddleware')

export class HandleableMiddleware extends ExtensibleMiddleware {
  constructor(handleableMiddleware, options={}) {
    super(options)

    this[_handleableMiddleware] = handleableMiddleware
  }

  toMainHandleableMiddleware() {
    return safeHandler(this[_handleableMiddleware])
  }

  get componentType() {
    return 'HandleableMiddleware'
  }
}

export const handleableMiddleware = (middleware, options) =>
  new HandleableMiddleware(middleware, options)