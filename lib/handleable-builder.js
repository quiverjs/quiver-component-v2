import { HandlerComponent } from './handler.js'
import { MiddlewareComponent } from './middleware.js'
import { mixinMiddlewareExtensible } from './extend-middleware.js'

import { copy } from 'quiver-object'
import { resolve } from 'quiver-promise'
import { loadHandleable } from 'quiver-config'

class HandleableBuilder extends HandlerComponent {
  constructor(handleableBuilder, options={}) {
    this._name = name
    this._handleableBuilder = handleableBuilder

    this._initMiddlewareExtension(options)
    super(options)
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

  loadHandleable(config, options={}) {
    return loadHandleable(config, this, options)
  }

  loadHandler(config, options) {
    return loadHandleable(config, options)
  }
}

mixinMiddlewareExtensible(HandleableBuilder)

export HandleableBuilder
