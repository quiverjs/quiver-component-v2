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

  doFork(forkedInstance, forkTable) {
    this.forkMiddlewares(forkedInstance, forkTable)
    super.doFork(forkedInstance, forkTable)
  }

  forkMiddlewares(forkedInstance, forkTable) {
    forkedInstance._middlewareComponents = 
      this._middlewareComponents.map(
        component => component.fork(forkTable))
  }

  implement(componentMap) {
    this.implementMiddlewares(componentMap)
    super.implement(componentMap)
  }

  implementMiddlewares(componentMap) {
    this._middlewareComponents.forEach(
      component => component.implement(componentMap))
  }

  toExtendMiddleware() {
    return combineMiddlewareComponents(
        this._middlewareComponents)
  }

  get middlewareComponents() {
    return this._middlewareComponents.slice()
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
    return this.handlerLoader(config, this, options)
  }

  get handlerLoader() {
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
