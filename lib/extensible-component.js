import { 
  HandlerComponent, MiddlewareComponent 
} from './component.js'

import { 
  combineMiddlewares, 
  combineBuilderWithMiddleware 
} from './util/middleware.js'

import { 
  mixinMiddlewareExtensible, 
} from './mixin-middleware.js'

export class ExtensibleHandler extends HandlerComponent {
  constructor(options) {
    this.initMiddlewareExtension(options)
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

  privatize(privateInstance, privateTable) {
    this.privatizeMiddlewares(privateInstance, privateTable)
    
    super.privatize(privateInstance, privateTable)
  }

  toJson() {
    var json = super.toJson()
    json.middlewares = this.middlewareJson()
    return json
  }
}
mixinMiddlewareExtensible(ExtensibleHandler.prototype)

export class ExtensibleMiddleware extends MiddlewareComponent {
  constructor(options) {
    this.initMiddlewareExtension(options)
    super(options)
  }

  get handleableMiddleware() {
    var mainMiddleware = this.mainHandleableMiddleware
    var extendMiddleware = this.extendMiddleware

    return combineMiddlewares([mainMiddleware, extendMiddleware])
  }

  privatize(privateInstance, privateTable) {
    this.privatizeMiddlewares(privateInstance, privateTable)

    super.privatize(privateInstance, privateTable)
  }

  toJson() {
    var json = super.toJson()
    json.middlewares = this.middlewareJson()
    return json
  }
}
mixinMiddlewareExtensible(ExtensibleMiddleware.prototype)