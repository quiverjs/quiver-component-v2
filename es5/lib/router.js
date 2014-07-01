"use strict";
Object.defineProperties(exports, {
  RouteList: {get: function() {
      return RouteList;
    }},
  RouterHandler: {get: function() {
      return RouterHandler;
    }},
  __esModule: {value: true}
});
var HandlerComponent = $traceurRuntime.assertObject(require('./handler.js')).HandlerComponent;
var HandleableBuilder = $traceurRuntime.assertObject(require('./handleable-builder.js')).HandleableBuilder;
var mixinMiddlewareExtensible = $traceurRuntime.assertObject(require('./extend-middleware.js')).mixinMiddlewareExtensible;
var $__2 = $traceurRuntime.assertObject(require('./util.js')),
    combineMiddlewareComponents = $__2.combineMiddlewareComponents,
    combineBuilderMiddleware = $__2.combineBuilderMiddleware;
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var loadHandleable = $traceurRuntime.assertObject(require('quiver-loader')).loadHandleable;
var combineUrlBuilders = $traceurRuntime.assertObject(require('quiver-router')).combineUrlBuilders;
var RouteList = function RouteList(routes, options) {
  this._routes = routes;
  this._initMiddlewareExtension(options);
};
($traceurRuntime.createClass)(RouteList, {
  get routes() {
    return this._routes;
  },
  buildRoutes: function(config, routeIndex) {
    var middleware = combineMiddlewareComponents(this.middlewareComponents);
    var promises = this.routes.map((function(route) {
      var component = route.handlerComponent;
      var builder = route.handleableBuilder;
      var loaderBuilder = (function(config) {
        return loadHandleable(config, component, builder);
      });
      return middleware(config, builder).then((function(handleable) {
        return route.addRoute(routeIndex, handleable);
      }));
    }));
    return Promise.all(promises);
  }
}, {}, Component);
mixinMiddlewareExtensible(RouteList);
var RouterHandler = function RouterHandler() {
  var routeLists = arguments[0] !== (void 0) ? arguments[0] : [];
  var options = arguments[1];
  this._routeLists = routeLists;
  this._defaultRouteList = new RouteList();
  this._initMiddlewareExtension(options);
};
($traceurRuntime.createClass)(RouterHandler, {
  addRoute: function(route) {
    if (!(route instanceof Route))
      throw new TypeError('route must be instance of Route');
    this._defaultRouteList.push(route);
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
        var promise = defaultHandler.loadHandleable(copy(config)).then((function(handleable) {
          return routeIndex.setDefaultRoute(handleable);
        }));
        promises.push(promise);
      }
      return Promise.all(promises).then((function() {
        return routerHandleable(routeIndex);
      }));
    });
  }
}, {}, HandleableBuilder);
