import { Route, StaticRoute, DynamicRoute, RegexRoute, ParamRoute } from './route.js'
import { routerHandleable } from './util/router.js'
import { createRouteIndex } from './util/route-index.js'
import { Component, HandlerComponent } from './component.js'
import { mixinMiddlewareExtensible } from './extend-middleware.js'
import { ExtensibleHandler } from './extensible-component.js'

import { 
  combineMiddlewareComponents, combineBuilderMiddleware, 
  combineBuilderWithMiddleware
} from './util/middleware.js'

import { copy } from 'quiver-object'

export class RouteList extends Component {
  constructor(options={}) {
    this._routes = []
    this._initMiddlewareExtension(options)

    super(options)
  }

  get routes() {
    return this._routes.slice()
  }

  addRoute(route) {
    if(!(route instanceof Route)) {
      throw new Error('route must be of type Route')
    }

    this._routes.push(route)

    return this
  }

  addStaticRoute(handler, path) {
    return this.addRoute(new StaticRoute(handler, path))
  }

  addParamRoute(handler, path) {
    return this.addRoute(new ParamRoute(handler, path))
  }

  addRegexRoute(handler, regex, fields) {
    return this.addRoute(new RegexRoute(handler, regex, fields))
  }

  addDynamicRoute(handler, matcher) {
    return this.addRoute(new DynamicRoute(handler, matcher))
  }

  buildRoutes(config, routeIndex) {
    var middleware = this.extendMiddleware

    var promises = this.routes.map(route => {
      var component = route.handlerComponent
      var builder = route.handleableBuilder

      return middleware(copy(config), builder).then(handleable =>
        route.addRoute(routeIndex, handleable))
    })

    return Promise.all(promises)
  }

  get type() {
    return 'route list'
  }

  toJson() {
    var json = super.toJson()
    
    var routes = this.routes

    if(routes.length > 0)
      json.routes = this.routes.map(route => route.toJson())
    
    json.middlewares = this.middlewareJson()

    return json
  }
}
mixinMiddlewareExtensible(RouteList)

var loadDefaultRoute = (config, component, routeIndex) =>
  component.loadHandleable(copy(config))
    .then(handleable => 
      routeIndex.setDefaultRoute(handleable))

export class Router extends ExtensibleHandler {
  constructor(options={}) {
    this._routeLists = []
    this._defaultRouteList = new RouteList()

    super(options)
  }

  addRoute(route) {
    if(!(route instanceof Route)) throw new TypeError(
      'route must be instance of Route')

    this._defaultRouteList.addRoute(route)
    return this
  }

  addStaticRoute(handler, path) {
    this._defaultRouteList.addStaticRoute(handler, path)

    return this
  }

  addParamRoute(handler, path) {
    this._defaultRouteList.addParamRoute(handler, path)

    return this
  }

  addRegexRoute(handler, regex, fields) {
    this._defaultRouteList.addRegexRoute(handler, regex, fields)

    return this
  }

  addDynamicRoute(handler, matcher) {
    this._defaultRouteList.addDynamicRoute(handler, matcher)

    return this
  }

  addRouteList(routeList) {
    if(!(routeList instanceof RouteList)) throw new TypeError(
      'route list must be instance of RouteList')

    this._routeLists.push(routeList)
    return this
  }

  get routeLists() {
    return [this._defaultRouteList, ...this._routeLists]
  }

  get defaultHandler() {
    return this._defaultHandler
  }

  setDefaultHandler(handlerComponent) {
    if(this._defaultHandler) throw new Error(
      'router component already has default route')

    this._defaultHandler = handlerComponent
    return this
  }

  get mainHandleableBuilder() {
    var routeLists = this.routeLists

    return config => {
      var routeIndex = createRouteIndex()

      var promises = routeLists.map(routeList =>
        routeList.buildRoutes(config, routeIndex))

      var defaultHandler = this.defaultHandler

      if(defaultHandler) {
        promises.push(loadDefaultRoute(config, defaultHandler, routeIndex))
      }

      return Promise.all(promises).then(() =>
        routerHandleable(routeIndex))
    }
  }

  get type() {
    return 'router'
  }

  toJson() {
    var json = super.toJson()

    json.routeLists = this.routeLists.map(routeList => routeList.toJson())

    var defaultHandler = this.defaultHandler
    if(defaultHandler)
      json.defaultHandler = defaultHandler.toJson()

    json.middlewares = this.middlewareJson()
    
    return json
  }
}

export var routeList = options =>
  new RouteList(options)

export var router = options =>
  new Router(options)