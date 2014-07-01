import { HandlerComponent } from './handler.js'
import { urlManagedBuilder } from './util/url.js'

import {
  createRegexRouteMatcher,
  createParamRouteMatcher,
  createParamurlBuilder
} from 'quiver-router'

export class Route extends Component {
  constructor(handlerComponent, options) {
    if(!(handlerComponent instanceof HandlerComponent))
      throw new TypeError('input handler component must be of type HandlerComponent')

    this._handlerComponent = handlerComponent

    var { urlBuilder } = options
    this._urlBuilder = urlBuilder
  }

  get handleableBuilder() {
    var handlerComponent = this.handlerComponent
    var builder = handlerComponent.handleableBuilder
    var urlBuilder = this.urlBuilder

    return urlManagedBuilder(builder, urlBuilder)
  }

  get handlerComponent() {
    return this._handlerComponent
  }

  get urlBuilder() {
    return this._urlBuilder
  }
}

export class StaticRoute extends Route {
  constructor(handlerComponent, staticPath, options) {
    if(typeof(staticPath) != 'string')
      throw new TypeError('staticPath must be provided as string')

    this._staticPath = staticPath

    var staticUrlBuilder = () => staticPath
    options.urlBuilder = options.urlBuilder || staticUrlBuilder

    super(handlerComponent, options)
  }

  addRoute(routeIndex, handler) {
    routeIndex.addStaticRoute(handler, this.staticPath)
  }

  get staticPath() {
    return this._staticPath
  }
}

export class DynamicRoute extends Route {
  constructor(handlerComponent, matcher, options) {
    if(typeof(matcher) != 'function')
      throw new TypeError('matcher must be of type function')

    this._matcher = matcher

    super(handlerComponent, options)
  }

  addRoute(routeIndex, handler) {
    routeIndex.addDynamicRoute(handler, this.matcher)
  }

  get matcher() {
    return this._matcher
  }
}

export class RegexRoute extends DynamicRoute {
  constructor(handlerComponent, regex, options) {
    if(!(regex instance of RegExp))
      throw new TypeError('regex must be regular expression')

    this._regex = regex

    var matcher = createRegexRouteMatcher(regex)

    super(handlerComponent, matcher, options)
  }

  get regex() {
    return this._regex
  }
}

export class ParamRoute extends RegexRoute {
  constructor(handlerComponent, paramPath, options) {
    if(tyeof(paramPath) != 'string')
      throw new TypeError('param path must be of type string')

    this._paramPath = paramPath

    var matcher = createParamRouteMatcher(paramPath)

    options.urlBuilder = options.urlBuilder || createParamUrlBuilder(paramPath)

    super(handlerComponent, matcher, options)
  }

  get paramPath() {
    return this._paramPath
  }
}
