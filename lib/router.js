import { Route, RouteList } from './route.js'
import { routerHandleable } from './util/router.js'
import { createRouteIndex } from './util/route-index.js'
import { Component, HandlerComponent } from './component.js'
import { mixinMiddlewareExtensible } from './extend-middleware.js'

import { 
  combineMiddlewareComponents, combineBuilderMiddleware 
} from './util/middleware.js'

import { copy } from 'quiver-object'

export class RouteList extends Component {
  constructor(routes=[], options={}) {
    this._routes = routes
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
  }

  buildRoutes(config, routeIndex) {
    var middleware = this.extendMiddleware

    var promises = this.routes.map(route => {
      var component = route.handlerComponent
      var builder = route.handleableBuilder

      return middleware(config, builder).then(handleable =>
        route.addRoute(routeIndex, handleable))
    })

    return Promise.all(promises)
  }
}
mixinMiddlewareExtensible(RouteList)

var loadDefaultRoute = (config, component, routeIndex) =>
  component.loadHandleable(copy(config))
    .then(handleable => 
      routeIndex.setDefaultRoute(handleable))

export class Router extends HandlerComponent {
  constructor(routeLists=[], options={}) {
    this._routeLists = routeLists
    this._defaultRouteList = new RouteList()
    this._initMiddlewareExtension(options)

    super(options)
  }

  addRoute(route) {
    if(!(route instanceof Route)) throw new TypeError(
      'route must be instance of Route')

    this._defaultRouteList.addRoute(route)
  }

  addRouteList(routeList) {
    if(!(routeList instanceof RouteList)) throw new TypeError(
      'route list must be instance of RouteList')

    this._routeLists.push(routeList)
  }

  setDefaultHandler(handlerComponent) {
    if(this._defaultRoute) throw new Error(
      'router component already has default route')

    this._defaultRoute = handlerComponent
  }

  get handleableBuilder() {
    var routeLists = [this._defaultRouteList, ...this._routeLists]

    return config => {
      var routeIndex = createRouteIndex()

      var promises = routeLists.map(routeList =>
        routeList.buildRoutes(config, routeIndex))

      var defaultHandler = this._defaultRoute

      if(defaultHandler) {
        promises.push(loadDefaultRoute(config, defaultHandler, routeIndex))
      }

      return Promise.all(promises).then(() =>
        routerHandleable(routeIndex))
    }
  }
}
mixinMiddlewareExtensible(Router)