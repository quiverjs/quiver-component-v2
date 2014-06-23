export var mixinMiddlewareExtensible = Class => {
  var proto = Object.getPrototypeOf(Class)

  proto._initMiddlewareExtension = function(options) {
    this._middlewareComponents = []

    var { middlewares } = options

    if(middlewares) {
      middlewares.forEach(middleware =>
        this.addMiddleware(middleware))

      this.freeze()
    }
  }

  proto.addMiddleware = function(middleware) {
    if(this.isFrozen) throw new Error('Component is already frozen')

    if(!(middleware instanceof MiddlewareComponent)) {
      throw new TypeError('middleware must be of type MiddlewareComponent')
    }

    this._middlewareComponents.push(middleware)

    return this
  }

  Object.defineProperty(proto, 'middlewareComponents', {
    get: function() {
      return this._middlewareComponents.slice()
    }
  })
}
