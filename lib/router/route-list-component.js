import { Component } from '../component'

import {
  Route, StaticRoute, DynamicRoute, RegexRoute, ParamRoute
} from './route-component'

import { 
  mixinMiddlewareExtensible 
} from '../mixin-middleware'

import { 
  combineBuilderWithMiddleware
} from '../util/middleware'

export class RouteList extends Component {
  constructor(options={}) {
    this._routes = []
    this.initMiddlewareExtension(options)

    super(options)
  }

  get routes() {
    return this._routes
  }

  get routeBuildSpecs() {
    var middleware = this.extendMiddleware

    return this.routes.map(route => {
      var builder = route.handleableBuilder
      var routeSpec = route.routeSpec

      routeSpec.builder = combineBuilderWithMiddleware(
        builder, middleware)

      return routeSpec
    })
  }

  addRoute(route) {
    if(!(route instanceof Route)) {
      throw new Error('route must be of type Route')
    }

    this._routes.push(route)

    return this
  }

  staticRoute(path, handler) {
    return this.addRoute(new StaticRoute(handler, path))
  }

  paramRoute(path, handler) {
    return this.addRoute(new ParamRoute(handler, path))
  }

  regexRoute(regex, fields, handler) {
    return this.addRoute(new RegexRoute(handler, regex, fields))
  }

  dynamicRoute(matcher, handler) {
    return this.addRoute(new DynamicRoute(handler, matcher))
  }

  privatize(privateInstance, privateTable) {
    privateInstance._routes = this._routes.map(
      route => route.makePrivate(privateTable))

    this.privatizeMiddlewares(privateInstance, privateTable)

    super.privatize(privateInstance, privateTable)
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
mixinMiddlewareExtensible(RouteList.prototype)

export var routeList = options =>
  new RouteList(options)