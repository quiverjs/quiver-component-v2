import { assertInstanceOf } from 'quiver-object'
import { loadHandleable } from './util/loader.js'
import { HandlerComponent } from './component.js'
import { 
  ExtensibleHandler, ExtensibleMiddleware 
} from './extensible-component.js'
import { 
  combineBuilderWithMiddleware, combineMiddlewares 
} from './util/middleware.js'

export class ExtendedHandler extends ExtensibleHandler {
  constructor(handlerComponent, options={}) {
    assertInstanceOf(handlerComponent, HandlerComponent,
      'must extend from another handler component')

    this._parentHandler = handlerComponent

    super(options)
  }

  get mainHandleableBuilder() {
    return this._parentHandler.handleableBuilder
  }

  get parentHandler() {
    return this._parentHandler
  }

  get handlerLoader() {
    return this.parentHandler.handlerLoader
  }

  get type() {
    return 'extend handler'
  }

  toJson() {
    var json = super.toJson()
    
    json.parentHandler = this.parentHandler.toJson()

    return json
  }
}

export class ExtendedMiddleware extends ExtensibleMiddleware {
  constructor(middlewareComponent, options={}) {
    assertInstanceOf(middlewareComponent, MiddlewareComponent,
      'must extend from another middleware component')

    this._parentMiddleware = middlewareComponent

    super(options)
  }

  get mainHandleableMiddleware() {
    return this.parentMiddleware.handleableMiddleware
  }

  get parentMiddleware() {
    return this._parentMiddleware
  }

  get type() {
    return 'extend middleware'
  }

  toJson() {
    var json = super.toJson()
    
    json.parentMiddleware = this.parentMiddleware.toJson()

    return json
  }
}

export var extendHandler = (handler, options) =>
  new ExtendedHandler(handler, options)

export var extendMiddleware = (middleware, options) =>
  new ExtendedMiddleware(middleware, options)