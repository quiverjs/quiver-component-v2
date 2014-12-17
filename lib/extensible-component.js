import { copy } from 'quiver-object'
import { Component } from './component'

import { 
  combineMiddlewares, 
  combineMiddlewareComponents,
  combineBuilderWithMiddleware
} from './util/middleware'

import { loadHandleable } from './util/loader'

var copyConfigBuilder = builder =>
  config =>
    builder(copy(config))

export class ExtensibleComponent extends Component {
  constructor(options={}) {
    this._middlewareComponents = []
    super(options)
  }

  addMiddleware(middleware) {
    if(!middleware.isMiddlewareComponent)
      throw new TypeError('middleware must be ' +
        'of type MiddlewareComponent')

    this._middlewareComponents.push(middleware)

    return this
  }

  middleware(middleware) {
    return this.addMiddleware(middleware)
  }

  each(iteratee) {
    this._middlewareComponents.forEach(iteratee)
    super.each(iteratee)
  }

  doMap(target, mapper) {
    target._middlewareComponents = 
      this._middlewareComponents.map(mapper)

    super.doMap(target, mapper)
  }

  toExtendMiddleware() {
    return combineMiddlewareComponents(
        this._middlewareComponents)
  }

  get middlewareComponents() {
    return this._middlewareComponents
  }
}

export class ExtensibleHandler extends ExtensibleComponent {
  constructor(options) {
    var { copyConfig=true } = options
    this._copyConfig = copyConfig

    super(options)
  }

  toHandleableBuilder() {
    var copyConfig = this._copyConfig

    var mainBuilder = this.toMainHandleableBuilder()
    var extendMiddleware = this.toExtendMiddleware()

    var builder = combineBuilderWithMiddleware(
      mainBuilder, extendMiddleware)

    if(copyConfig)
      builder = copyConfigBuilder(builder)

    return builder
  }

  toMainHandleableBuilder() {
    throw new Error('unimplemented')
  }

  loadHandleable(config, options) {
    return loadHandleable(config, this, options)
  }

  loadHandler(config, options) {
    var loader = this.handlerLoader
    return loader(config, this, options)
  }

  setLoader(handlerLoader) {
    this._handlerLoader = handlerLoader
    return this
  }

  get handlerLoader() {
    if(this._handlerLoader) return this._handlerLoader

    return this.defaultLoader
  }

  get defaultLoader() {
    return loadHandleable
  }

  get type() {
    return 'handler'
  }

  get isHandlerComponent() {
    return true
  }
}

export class ExtensibleMiddleware extends ExtensibleComponent {
  toHandleableMiddleware() {
    var mainMiddleware = this.toMainHandleableMiddleware()
    var extendMiddleware = this.toExtendMiddleware()

    return combineMiddlewares([mainMiddleware, extendMiddleware])
  }

  toMainHandleableMiddleware() {
    throw new Error('unimplemented')
  }

  get isMiddlewareComponent() {
    return true
  }
}
