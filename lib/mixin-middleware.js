import { MiddlewareComponent } from './component.js'
import { combineMiddlewareComponents } from './util/middleware.js'

export var mixinMiddlewareExtensible = prototype => {
  prototype._initMiddlewareExtension = function(options={}) {
    this._middlewareComponents = []

    var { middlewares } = options

    if(middlewares) {
      middlewares.forEach(middleware =>
        this.addMiddleware(middleware))
    }
  }

  prototype.addMiddleware = function(middleware) {
    if(!(middleware instanceof MiddlewareComponent))
      throw new TypeError('middleware must be of type MiddlewareComponent')

    this._middlewareComponents.push(middleware)

    return this
  }

  prototype.middlewareJson = function() {
    var middlewares = this.middlewareComponents
    if(middlewares.length == 0) return undefined

    return middlewares.map(component =>
      component.toJson())
  }

  prototype.privatizeMiddlewares = function(copy) {
    copy._middlewareComponents = this._middlewareComponents
    .map(component => component.fork())
  }

  Object.defineProperty(prototype, 'middlewareComponents', {
    get() {
      return this._middlewareComponents.slice()
    }
  })

  Object.defineProperty(prototype, 'extendMiddleware', {
    get() {
      return combineMiddlewareComponents(
        this._middlewareComponents)
    }
  })
}
