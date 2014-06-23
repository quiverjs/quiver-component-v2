import { MiddlewareComponent } from './middleware.js'

var combineBuilderWithMiddleware = (builder, middleware) =>
  config => middleware(config, builder)

var combineBuilderWithMiddlewares = (builder, middlewares) =>
  middlewares.reduce(combineBuilderWithMiddleware, builder)

export class HandleableMiddleware extends MiddlewareComponent {
  constructor(handleableMiddleware) {
    this._handleableMiddleware = handleableMiddleware
    this._middlewareComponents = []
  }

  get rawHandleableMiddleware() {
    return this._handleableMiddleware
  }

  get handleableMiddleware() {
    var middleware = this._handleableMiddleware
    var extendMiddlewares = this._middlewareComponents.map(
      component => component.handleableMiddleware)

    var middlewares = [middleware, ...extendMiddlewares]

    return (config, builder) => {
      var extendedBuilder = combineBuilderWithMiddlewares(
        builder, middlewares)

      return extendedBuilder(config)
    }
  }

  addMiddleware(middleware) {
    if(component.isFrozen) throw new Error('Component is already frozen')

    if(!(middleware instanceof MiddlewareComponent)) {
      throw new TypeError('middleware must be of type MiddlewareComponent')
    }

    component._middlewareComponents.push(middleware)

    return this
  }

  get middlewareComponents() {
    return this._middlewareComponents.slice()
  }
}
