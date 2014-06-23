import { HandlerComponent } from './handler.js'
import { MiddlewareComponent } from './middleware.js'

class HandleableBuilder extends HandlerComponent {
  constructor(handleableBuilder) {
    this._handleableBuilder = handleableBuilder
    this._middlewareComponents = []
  }

  get rawHandleableBuilder() {
    return this._handleableBuilder
  }

  get handleableBuilder() {
    var builder = this._handleableBuilder
    var middlewareComponents = this._middlewareComponents

    return middlewareComponents.reduce((builder, middlewareComponent) => {
      var middleware = middlewareComponent.handleableMiddleware

      return config => middleware(config, builder)
    }, builder)
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
