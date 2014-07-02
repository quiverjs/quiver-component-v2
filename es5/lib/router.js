"use strict";
Object.defineProperties(exports, {
  RouteList: {get: function() {
      return RouteList;
    }},
  Router: {get: function() {
      return Router;
    }},
  __esModule: {value: true}
});
var $__2 = $traceurRuntime.assertObject(require('./route.js')),
    Route = $__2.Route,
    RouteList = $__2.RouteList;
var routerHandleable = $traceurRuntime.assertObject(require('./util/router.js')).routerHandleable;
var createRouteIndex = $traceurRuntime.assertObject(require('./util/route-index.js')).createRouteIndex;
var $__2 = $traceurRuntime.assertObject(require('./component.js')),
    Component = $__2.Component,
    HandlerComponent = $__2.HandlerComponent;
var mixinMiddlewareExtensible = $traceurRuntime.assertObject(require('./extend-middleware.js')).mixinMiddlewareExtensible;
var $__2 = $traceurRuntime.assertObject(require('./util/middleware.js')),
    combineMiddlewareComponents = $__2.combineMiddlewareComponents,
    combineBuilderMiddleware = $__2.combineBuilderMiddleware;
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var RouteList = function RouteList() {
  var routes = arguments[0] !== (void 0) ? arguments[0] : [];
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._routes = routes;
  this._initMiddlewareExtension(options);
  $traceurRuntime.superCall(this, $RouteList.prototype, "constructor", [options]);
};
var $RouteList = RouteList;
($traceurRuntime.createClass)(RouteList, {
  get routes() {
    return this._routes.slice();
  },
  addRoute: function(route) {
    if (!(route instanceof Route)) {
      throw new Error('route must be of type Route');
    }
    this._routes.push(route);
  },
  buildRoutes: function(config, routeIndex) {
    var middleware = this.extendMiddleware;
    var promises = this.routes.map((function(route) {
      var component = route.handlerComponent;
      var builder = route.handleableBuilder;
      return middleware(config, builder).then((function(handleable) {
        return route.addRoute(routeIndex, handleable);
      }));
    }));
    return Promise.all(promises);
  }
}, {}, Component);
mixinMiddlewareExtensible(RouteList);
var loadDefaultRoute = (function(config, component, routeIndex) {
  return component.loadHandleable(copy(config)).then((function(handleable) {
    return routeIndex.setDefaultRoute(handleable);
  }));
});
var Router = function Router() {
  var routeLists = arguments[0] !== (void 0) ? arguments[0] : [];
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._routeLists = routeLists;
  this._defaultRouteList = new RouteList();
  this._initMiddlewareExtension(options);
  $traceurRuntime.superCall(this, $Router.prototype, "constructor", [options]);
};
var $Router = Router;
($traceurRuntime.createClass)(Router, {
  addRoute: function(route) {
    if (!(route instanceof Route))
      throw new TypeError('route must be instance of Route');
    this._defaultRouteList.addRoute(route);
  },
  addRouteList: function(routeList) {
    if (!(routeList instanceof RouteList))
      throw new TypeError('route list must be instance of RouteList');
    this._routeLists.push(routeList);
  },
  setDefaultHandler: function(handlerComponent) {
    if (this._defaultRoute)
      throw new Error('router component already has default route');
    this._defaultRoute = handlerComponent;
  },
  get handleableBuilder() {
    var $__0 = this;
    var routeLists = $traceurRuntime.spread([this._defaultRouteList], this._routeLists);
    return (function(config) {
      var routeIndex = createRouteIndex();
      var promises = routeLists.map((function(routeList) {
        return routeList.buildRoutes(config, routeIndex);
      }));
      var defaultHandler = $__0._defaultRoute;
      if (defaultHandler) {
        promises.push(loadDefaultRoute(config, defaultHandler, routeIndex));
      }
      return Promise.all(promises).then((function() {
        return routerHandleable(routeIndex);
      }));
    });
  }
}, {}, HandlerComponent);
mixinMiddlewareExtensible(Router);
