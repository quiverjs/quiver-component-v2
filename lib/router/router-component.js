import { copy } from 'quiver-object'
import { async } from 'quiver-promise'
import { normalizeConfig } from '../util/config'

import { 
  ExtensibleHandler 
} from '../extensible-component'

import { 
  Component, HandlerComponent 
} from '../component'

import { componentList } from '../list'

import { RouteList } from './route-list-component'

import {
  routeBuildSpecsToRouterBuilder
} from './route-specs'

export class Router extends ExtensibleHandler {
  constructor(options={}) {
    super(options)

    this.subComponents.defaultRouteList = new RouteList()
    this.subComponents.routeListList = componentList() 
  }

  addRoute(route) {
    if(!route.isRoute) {
      throw new TypeError('route must be instance of Route')
    }

    this.defaultRouteList.addRoute(route)
    return this
  }

  staticRoute(path, handler) {
    this.defaultRouteList.staticRoute(path, handler)

    return this
  }

  paramRoute(path, handler) {
    this.defaultRouteList.paramRoute(path, handler)

    return this
  }

  regexRoute(regex, fields, handler) {
    this.defaultRouteList.regexRoute(regex, fields, handler)

    return this
  }

  dynamicRoute(matcher, handler) {
    this.defaultRouteList.dynamicRoute(matcher, handler)

    return this
  }

  routeList(routeList) {
    if(!routeList.isRouteList) {
      throw new TypeError(
        'route list must be instance of RouteList')
    }

    this.routeListList.push(routeList)
    return this
  }

  get routeLists() {
    return [this.defaultRouteList, ...this.routeListList.array]
  }

  get defaultRouteList() {
    return this.subComponents.defaultRouteList
  }

  get routeListList() {
    return this.subComponents.routeListList
  }

  get defaultHandler() {
    return this.subComponents.defaultHandler
  }

  defaultRoute(handlerComponent) {
    if(this.defaultHandler) throw new Error(
      'router component already has default route')

    this.subComponents.defaultHandler = handlerComponent
    return this
  }

  toMainHandleableBuilder() {
    let routeLists = this.routeLists

    let routeBuildSpecs = [].concat.apply([],
      routeLists.map(routeList =>
        routeList.toRouteBuildSpecs()))

    let defaultHandler = this.defaultHandler

    if(defaultHandler) {
      routeBuildSpecs.push({
        routeType: 'default',
        builder: defaultHandler.toHandleableBuilder()
      })
    }

    return routeBuildSpecsToRouterBuilder(
      routeBuildSpecs)
  }

  get type() {
    return 'router'
  }

  toJson() {
    let json = super.toJson()

    json.routeLists = this.routeLists.map(routeList => routeList.toJson())

    let defaultHandler = this.defaultHandler
    if(defaultHandler)
      json.defaultHandler = defaultHandler.toJson()

    json.middlewares = this.middlewareJson()
    
    return json
  }
}

export let router = options =>
  new Router(options)

export let makeRouter = options =>
  new Router(options)
