import { urlManagedBuilder } from './util/url'
import { Component, HandlerComponent } from './component'

import {
  regexMatcher, paramMatcher, paramUrlBuilder
} from './util/route'

export class Route extends Component {
  constructor(handlerComponent, options={}) {
    if(!(handlerComponent instanceof HandlerComponent))
      throw new TypeError('input handler component must be of type HandlerComponent')

    var { urlBuilder } = options
    this._urlBuilder = urlBuilder

    super(options)
    this.subComponents.routeHandler = handlerComponent
  }

  get handleableBuilder() {
    var handlerComponent = this.handlerComponent
    var urlBuilder = this.urlBuilder

    return urlManagedBuilder(handlerComponent, urlBuilder)
  }

  get handlerComponent() {
    return this.subComponents.routeHandler
  }

  get urlBuilder() {
    return this._urlBuilder
  }

  get type() {
    return 'route'
  }

  toJson() {
    var json = super.toJson()
    json.handler = this.handlerComponent.toJson()
    return json
  }
}

export class StaticRoute extends Route {
  constructor(handlerComponent, staticPath, options={}) {
    if(!(handlerComponent instanceof HandlerComponent)) 
      throw new TypeError('handler must be of type HandlerComponent')

    if(typeof(staticPath) != 'string')
      throw new TypeError('staticPath must be provided as string')

    this._staticPath = staticPath

    var staticUrlBuilder = () => staticPath
    options.urlBuilder = options.urlBuilder || staticUrlBuilder

    super(handlerComponent, options)
  }

  addRoute(routeIndex, handler) {
    routeIndex.addStaticRoute(this.staticPath, handler)
  }

  get staticPath() {
    return this._staticPath
  }

  get type() {
    return 'static route'
  }

  toJson() {
    var json = super.toJson()
    json.staticPath = this.staticPath
    return json
  }
}

export class DynamicRoute extends Route {
  constructor(handlerComponent, matcher, options={}) {
    if(typeof(matcher) != 'function')
      throw new TypeError('matcher must be of type function')

    this._matcher = matcher

    super(handlerComponent, options)
  }

  addRoute(routeIndex, handler) {
    routeIndex.addDynamicRoute(this.matcher, handler)
  }

  get matcher() {
    return this._matcher
  }

  get type() {
    return 'dynamic route'
  }
}

export class RegexRoute extends DynamicRoute {
  constructor(handlerComponent, regex, matchFields=[], options={}) {
    if(!(regex instanceof RegExp))
      throw new TypeError('regex must be regular expression')

    this._regex = regex

    var matcher = regexMatcher(regex, matchFields)

    super(handlerComponent, matcher, options)
  }

  get regex() {
    return this._regex
  }

  get type() {
    return 'regex route'
  }
}

export class ParamRoute extends DynamicRoute {
  constructor(handlerComponent, paramPath, options={}) {
    if(typeof(paramPath) != 'string')
      throw new TypeError('param path must be of type string')

    this._paramPath = paramPath

    var matcher = paramMatcher(paramPath)

    options.urlBuilder = options.urlBuilder || paramUrlBuilder(paramPath)

    super(handlerComponent, matcher, options)
  }

  get paramPath() {
    return this._paramPath
  }

  get type() {
    return 'param route'
  }
  
  toJson() {
    var json = super.toJson()
    json.paramPath = this.paramPath
    return json
  }
}

export var staticRoute = (handler, path, options) =>
  new StaticRoute(handler, path, options)

export var dynamicRoute = (handler, matcher, options) =>
  new DynamicRoute(handler, matcher, options)

export var regexRoute = (handler, regex, fields, options) =>
  new RegexRoute(handler, regex, fields, options)

export var paramRoute = (handler, path, options) =>
  new ParamRoute(handler, path, options)