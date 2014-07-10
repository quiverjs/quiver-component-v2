import { MiddlewareComponent } from './component.js'
import { combineMiddlewareComponents } from './util/middleware.js'

var middlewareMixin = {
  initMiddlewareExtension(options={}) {
    this._middlewareComponents = []

    var { middlewares } = options

    if(middlewares) {
      middlewares.forEach(middleware =>
        this.addMiddleware(middleware))
    }
  },

  addMiddleware(middleware) {
    if(!(middleware instanceof MiddlewareComponent))
      throw new TypeError('middleware must be of type MiddlewareComponent')

    this._middlewareComponents.push(middleware)

    return this
  },

  middlewareJson() {
    var middlewares = this.middlewareComponents
    if(middlewares.length == 0) return undefined

    return middlewares.map(component =>
      component.toJson())
  },

  privatizeMiddlewares(privateCopy, bundle) {
    privateCopy._middlewareComponents = 
      this._middlewareComponents.map(
        component => component.makePrivate(bundle))
  }
}

export var mixinMiddlewareExtensible = prototype => {
  Object.assign(prototype, middlewareMixin)

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
