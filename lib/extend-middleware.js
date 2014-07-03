import { MiddlewareComponent } from './component.js'
import { combineMiddlewareComponents } from './util/middleware.js'

export var mixinMiddlewareExtensible = Class => {
  var proto = Class.prototype

  proto._initMiddlewareExtension = function(options={}) {
    this._middlewareComponents = []

    var { middlewares } = options

    if(middlewares) {
      middlewares.forEach(middleware =>
        this.addMiddleware(middleware))
    }
  }

  proto.addMiddleware = function(middleware) {
    if(!(middleware instanceof MiddlewareComponent))
      throw new TypeError('middleware must be of type MiddlewareComponent')

    this._middlewareComponents.push(middleware)

    return this
  }

  Object.defineProperty(proto, 'middlewareComponents', {
    get: function() {
      return this._middlewareComponents.slice()
    }
  })

  Object.defineProperty(proto, 'extendMiddleware', {
    get: function() {
      return combineMiddlewareComponents(
        this._middlewareComponents)
    }
  })
}
