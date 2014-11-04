import { async } from 'quiver-promise'
import { loadHandleable } from '../util/loader'

import { 
  combineBuilderWithMiddleware
} from '../util/middleware'

import { 
  Component, HandlerComponent 
} from '../component'

import { MethodRouter } from './method-router'

import {
  regexMatcher, paramMatcher, paramUrlBuilder
} from './dynamic-route'

var combineUrlBuilders = (urlBuilder1, urlBuilder2) => {
  if(!urlBuilder1 || !urlBuilder2) return null

  return (args, restPath='/') => {
    var newRestPath = urlBuilder2(args, restPath)

    return urlBuilder1(args, newRestPath)
  }
}

var urlMiddleware = urlBuilder =>
  async(function*(config, builder) {
    var newUrlBuilder = config.urlBuilder = combineUrlBuilders(
      config.urlBuilder, urlBuilder)

    var handleable = yield builder(config)
    
    if(!handleable.urlBuilder) {
      handleable.urlBuilder = newUrlBuilder
    }

    return handleable
  })

var routeBuilder = (component, urlBuilder, middleware) => {
  var mainBuilder = component.handleableBuilder
  var middlewares = []

  if(urlBuilder) {
    middlewares.push(urlMiddleware(urlBuilder))
  }

  middlewares.push(middleware)

  return combineBuilderWithMiddlewares(
    mainBuilder, middlewares)
}

export class Route extends Component {
  constructor(handlerComponent, options={}) {
    if(!(handlerComponent instanceof HandlerComponent)) {
      // argument is method map
      handlerComponent = new MethodRouter(handlerComponent)
    }

    var { urlBuilder } = options
    this._urlBuilder = urlBuilder

    super(options)
    this.subComponents.routeHandler = handlerComponent
  }

  get handleableBuilder() {
    var mainBuilder = this.handlerComponent.handleableBuilder
    var urlBuilder = this.urlBuilder

    if(urlBuilder) {
      return combineBuilderWithMiddleware(mainBuilder,
        urlMiddleware(urlBuilder))
    } else {
      return mainBuilder
    }
  }

  get routeSpec() {
    throw new Error('unimplemented')
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
    if(typeof(staticPath) != 'string')
      throw new TypeError('staticPath must be provided as string')

    this._staticPath = staticPath

    var urlBuilder = () => staticPath
    options.urlBuilder = options.urlBuilder || urlBuilder

    super(handlerComponent, options)
  }

  routeSpecsBuilder(middleware) {
    var staticPath = this.staticPath
    var routeBuilder = this.routeBuilder

    return async(function*(config) {
      var handleable = yield routeBuilder(config)

      return {
        routeType: 'static',
        path: staticPath,
        handleable
      }
    })
  }

  get routeSpec() {
    return {
      routeType: 'static',
      path: this.staticPath
    }
  }

  get staticPath() {
    return this._staticPath
  }

  get type() {
    return 'static route'
  }

  get routeType() {
    return 'static'
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

  get routeSpec() {
    return {
      routeType: 'dynamic',
      matcher: this.matcher
    }
  }

  get matcher() {
    return this._matcher
  }

  get type() {
    return 'dynamic route'
  }

  get routeType() {
    return 'dynamic'
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