import { Component } from '../component'
import { componentList } from '../list'

import {
  Route, StaticRoute, DynamicRoute, RegexRoute, ParamRoute
} from './route-component'

import { 
  ExtensibleComponent 
} from '../extensible-component'

import { 
  combineBuilderWithMiddleware
} from '../util/middleware'

export class RouteList extends ExtensibleComponent {
  constructor(options={}) {
    super(options)

    this.subComponents.routeList = componentList()
  }

  get routes() {
    return this.subComponents.routeList.array
  }

  toRouteBuildSpecs() {
    var middleware = this.toExtendMiddleware()

    return this.routes.map(route => {
      var builder = route.toHandleableBuilder()
      var routeSpec = route.routeSpec

      routeSpec.builder = combineBuilderWithMiddleware(
        builder, middleware)

      return routeSpec
    })
  }

  addRoute(route) {
    if(!route.isRoute) {
      throw new Error('route must be of type Route')
    }

    this.routes.push(route)

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

  get type() {
    return 'route list'
  }

  get isRouteList() {
    return true
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

export var routeList = options =>
  new RouteList(options)