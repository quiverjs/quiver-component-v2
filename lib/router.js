import { HandlerComponent } from './handler.js'
import { HandleableBuilder } from './handleable-builder.js'
import { mixinMiddlewareExtensible } from './extend-middleware.js'
import { combineMiddlewareComponents, combineBuilderMiddleware } from './util.js'

import { copy } from 'quiver-object'
import { loadHandleable } from 'quiver-loader'
import { combineUrlBuilders } from 'quiver-router'

export class RouteList extends Component {
  constructor(routes, options) {
    this._routes = routes
    this._initMiddlewareExtension(options)
  }

  get routes() {
    return this._routes
  }

  buildRoutes(config, routeIndex) {
    var middleware = combineMiddlewareComponents(
      this.middlewareComponents)

    var promises = this.routes.map(route => {
      var component = route.handlerComponent
      var builder = route.handleableBuilder

      var loaderBuilder = config =>
        loadHandleable(config, component, builder)

      return middleware(config, builder).then(handleable =>
        route.addRoute(routeIndex, handleable))
    })

    return Promise.all(promises)
  }
}
mixinMiddlewareExtensible(RouteList)

export class RouterHandler extends HandleableBuilder {
  constructor(routeLists=[], options) {
    this._routeLists = routeLists
    this._defaultRouteList = new RouteList()
    this._initMiddlewareExtension(options)
  }

  addRoute(route) {
    if(!(route instanceof Route)) throw new TypeError(
      'route must be instance of Route')

    this._defaultRouteList.push(route)
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
        var promise = defaultHandler.loadHandleable(copy(config))
          .then(handleable => routeIndex.setDefaultRoute(handleable))

        promises.push(promise)
      }

      return Promise.all(promises).then(() =>
        routerHandleable(routeIndex))
    }
  }
}