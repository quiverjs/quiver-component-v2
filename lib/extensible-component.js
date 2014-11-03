import { copy } from 'quiver-object'

import { 
  HandlerComponent, MiddlewareComponent 
} from './component'

import { 
  combineMiddlewares, 
  combineBuilderWithMiddleware 
} from './util/middleware'

import { 
  mixinMiddlewareExtensible, 
} from './mixin-middleware'

var copyConfigBuilder = builder =>
  config =>
    builder(copy(config))

export class ExtensibleHandler extends HandlerComponent {
  constructor(options) {
    var { copyConfig=true } = options
    this._copyConfig = copyConfig

    this.initMiddlewareExtension(options)
    super(options)
  }

  get handleableBuilder() {
    var copyConfig = this._copyConfig
    var mainBuilder = this.mainHandleableBuilder
    var extendMiddleware = this.extendMiddleware

    var builder = combineBuilderWithMiddleware(
      mainBuilder, extendMiddleware)

    if(copyConfig)
      builder = copyConfigBuilder(builder)

    return builder
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

  get mainHandleableMiddleware() {
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
mixinMiddlewareExtensible(ExtensibleMiddleware.prototype)