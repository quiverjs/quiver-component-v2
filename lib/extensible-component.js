import { 
  HandlerComponent, MiddlewareComponent 
} from './component.js'

import { 
  combineMiddlewares, 
  combineBuilderWithMiddleware 
} from './util/middleware.js'

import { 
  mixinMiddlewareExtensible, 
} from './extend-middleware.js'

export class ExtensibleHandler extends HandlerComponent {
  constructor(options) {
    this._initMiddlewareExtension(options)
    super(options)
  }

  get handleableBuilder() {
    var mainBuilder = this.mainHandleableBuilder
    var extendMiddleware = this.extendMiddleware

    return combineBuilderWithMiddleware(
      mainBuilder, extendMiddleware)
  }

  get mainHandleableBuilder() {
    throw new Error('unimplemented')
  }
}
mixinMiddlewareExtensible(ExtensibleHandler)

export class ExtensibleMiddleware extends MiddlewareComponent {
  constructor(options) {
    this._initMiddlewareExtension(options)
    super(options)
  }

  get handleableMiddleware() {
    var mainMiddleware = this.mainHandleableMiddleware
    var extendMiddleware = this.extendMiddleware

    return combineMiddlewares([mainMiddleware, extendMiddleware])
  }
}
mixinMiddlewareExtensible(ExtensibleMiddleware)