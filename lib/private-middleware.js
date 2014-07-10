import { assertInstanceOf } from 'quiver-object'

import { getInitTable } from './util/config.js'
import { MiddlewareComponent } from './component.js'
import { combineMiddlewares } from './util/middleware.js'
import { mixinMiddlewareExtensible } from './mixin-middleware.js'

export class PrivateMiddleware extends MiddlewareComponent {
  constructor(middlewareComponent, options={}) {
    assertInstanceOf(middlewareComponent, MiddlewareComponent,
      'Only MiddlewareComponent can be privatized')

    this._initMiddlewareExtension(options)
    this._middlewareComponent = middlewareComponent
    this._initKey = Symbol()
  }

  get handleableMiddleware() {
    var mainMiddleware = this._middlewareComponent
      .handleableMiddleware
    
    var extendMiddleware = this.extendMiddleware

    var middleware = combineMiddlewares(
      [mainMiddleware, extendMiddleware])

    var initKey = this._initKey

    return (config, builder) => {
      var initTable = getInitTable(config)

      if(initTable[initKey]) return builder(config)

      initTable[initKey] = true
      return middleware(config, builder)
    }
  }

  get type() {
    return 'private middleware'
  }

  toJson() {
    var json = super.toJson()
    json.middleware = this._middlewareComponent.toJson()
    return json
  }
}
mixinMiddlewareExtensible(PrivateMiddleware.prototype)

export var privateMiddleware = (middleware, options) =>
  new PrivateMiddleware(middleware, options)