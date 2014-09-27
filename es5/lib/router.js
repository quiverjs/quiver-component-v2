"use strict";
Object.defineProperties(exports, {
  RouteList: {get: function() {
      return RouteList;
    }},
  Router: {get: function() {
      return Router;
    }},
  routeList: {get: function() {
      return routeList;
    }},
  router: {get: function() {
      return router;
    }},
  __esModule: {value: true}
});
var $__quiver_45_object__,
    $__quiver_45_promise__,
    $__util_47_router_46_js__,
    $__util_47_route_45_index_46_js__,
    $__extensible_45_component_46_js__,
    $__component_46_js__,
    $__mixin_45_middleware_46_js__,
    $__route_46_js__,
    $__util_47_middleware_46_js__,
    $__util_47_config__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var routerHandleable = ($__util_47_router_46_js__ = require("./util/router.js"), $__util_47_router_46_js__ && $__util_47_router_46_js__.__esModule && $__util_47_router_46_js__ || {default: $__util_47_router_46_js__}).routerHandleable;
var createRouteIndex = ($__util_47_route_45_index_46_js__ = require("./util/route-index.js"), $__util_47_route_45_index_46_js__ && $__util_47_route_45_index_46_js__.__esModule && $__util_47_route_45_index_46_js__ || {default: $__util_47_route_45_index_46_js__}).createRouteIndex;
var ExtensibleHandler = ($__extensible_45_component_46_js__ = require("./extensible-component.js"), $__extensible_45_component_46_js__ && $__extensible_45_component_46_js__.__esModule && $__extensible_45_component_46_js__ || {default: $__extensible_45_component_46_js__}).ExtensibleHandler;
var $__5 = ($__component_46_js__ = require("./component.js"), $__component_46_js__ && $__component_46_js__.__esModule && $__component_46_js__ || {default: $__component_46_js__}),
    Component = $__5.Component,
    HandlerComponent = $__5.HandlerComponent;
var mixinMiddlewareExtensible = ($__mixin_45_middleware_46_js__ = require("./mixin-middleware.js"), $__mixin_45_middleware_46_js__ && $__mixin_45_middleware_46_js__.__esModule && $__mixin_45_middleware_46_js__ || {default: $__mixin_45_middleware_46_js__}).mixinMiddlewareExtensible;
var $__7 = ($__route_46_js__ = require("./route.js"), $__route_46_js__ && $__route_46_js__.__esModule && $__route_46_js__ || {default: $__route_46_js__}),
    Route = $__7.Route,
    StaticRoute = $__7.StaticRoute,
    DynamicRoute = $__7.DynamicRoute,
    RegexRoute = $__7.RegexRoute,
    ParamRoute = $__7.ParamRoute;
var $__8 = ($__util_47_middleware_46_js__ = require("./util/middleware.js"), $__util_47_middleware_46_js__ && $__util_47_middleware_46_js__.__esModule && $__util_47_middleware_46_js__ || {default: $__util_47_middleware_46_js__}),
    combineMiddlewareComponents = $__8.combineMiddlewareComponents,
    combineBuilderMiddleware = $__8.combineBuilderMiddleware,
    combineBuilderWithMiddleware = $__8.combineBuilderWithMiddleware;
var normalizeConfig = ($__util_47_config__ = require("./util/config"), $__util_47_config__ && $__util_47_config__.__esModule && $__util_47_config__ || {default: $__util_47_config__}).normalizeConfig;
var buildRoutes = async($traceurRuntime.initGeneratorFunction(function $__11(config, routeIndex, routes, middleware) {
  var i,
      route,
      component,
      builder,
      handleable;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          i = 0;
          $ctx.state = 11;
          break;
        case 11:
          $ctx.state = (i < routes.length) ? 5 : -2;
          break;
        case 8:
          i++;
          $ctx.state = 11;
          break;
        case 5:
          route = routes[i];
          component = route.handlerComponent;
          builder = route.handleableBuilder;
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return middleware(copy(config), builder);
        case 2:
          handleable = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          route.addRoute(routeIndex, handleable);
          $ctx.state = 8;
          break;
        default:
          return $ctx.end();
      }
  }, $__11, this);
}));
var RouteList = function RouteList() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  this._routes = [];
  this.initMiddlewareExtension(options);
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
    return this;
  },
  addStaticRoute: function(handler, path) {
    return this.addRoute(new StaticRoute(handler, path));
  },
  addParamRoute: function(handler, path) {
    return this.addRoute(new ParamRoute(handler, path));
  },
  addRegexRoute: function(handler, regex, fields) {
    return this.addRoute(new RegexRoute(handler, regex, fields));
  },
  addDynamicRoute: function(handler, matcher) {
    return this.addRoute(new DynamicRoute(handler, matcher));
  },
  buildRoutes: function(config, routeIndex) {
    var middleware = this.extendMiddleware;
    var routes = this.routes;
    return buildRoutes(config, routeIndex, routes, middleware);
  },
  privatize: function(privateInstance, privateTable) {
    privateInstance._routes = this._routes.map((function(route) {
      return route.makePrivate(privateTable);
    }));
    this.privatizeMiddlewares(privateInstance, privateTable);
    $traceurRuntime.superCall(this, $RouteList.prototype, "privatize", [privateInstance, privateTable]);
  },
  get type() {
    return 'route list';
  },
  toJson: function() {
    var json = $traceurRuntime.superCall(this, $RouteList.prototype, "toJson", []);
    var routes = this.routes;
    if (routes.length > 0)
      json.routes = this.routes.map((function(route) {
        return route.toJson();
      }));
    json.middlewares = this.middlewareJson();
    return json;
  }
}, {}, Component);
mixinMiddlewareExtensible(RouteList.prototype);
var loadDefaultRoute = (function(config, component, routeIndex) {
  return component.loadHandleable(config).then((function(handleable) {
    return routeIndex.setDefaultRoute(handleable);
  }));
});
var Router = function Router() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  this._routeLists = [];
  this._defaultRouteList = new RouteList();
  $traceurRuntime.superCall(this, $Router.prototype, "constructor", [options]);
};
var $Router = Router;
($traceurRuntime.createClass)(Router, {
  addRoute: function(route) {
    if (!(route instanceof Route))
      throw new TypeError('route must be instance of Route');
    this._defaultRouteList.addRoute(route);
    return this;
  },
  addStaticRoute: function(handler, path) {
    this._defaultRouteList.addStaticRoute(handler, path);
    return this;
  },
  addParamRoute: function(handler, path) {
    this._defaultRouteList.addParamRoute(handler, path);
    return this;
  },
  addRegexRoute: function(handler, regex, fields) {
    this._defaultRouteList.addRegexRoute(handler, regex, fields);
    return this;
  },
  addDynamicRoute: function(handler, matcher) {
    this._defaultRouteList.addDynamicRoute(handler, matcher);
    return this;
  },
  addRouteList: function(routeList) {
    if (!(routeList instanceof RouteList))
      throw new TypeError('route list must be instance of RouteList');
    this._routeLists.push(routeList);
    return this;
  },
  get routeLists() {
    return $traceurRuntime.spread([this._defaultRouteList], this._routeLists);
  },
  get defaultHandler() {
    return this._defaultHandler;
  },
  setDefaultHandler: function(handlerComponent) {
    if (this._defaultHandler)
      throw new Error('router component already has default route');
    this._defaultHandler = handlerComponent;
    return this;
  },
  get mainHandleableBuilder() {
    var routeLists = this.routeLists;
    var defaultHandler = this.defaultHandler;
    return async($traceurRuntime.initGeneratorFunction(function $__12(config) {
      var routeIndex,
          i;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              normalizeConfig(config);
              routeIndex = createRouteIndex();
              $ctx.state = 16;
              break;
            case 16:
              i = 0;
              $ctx.state = 7;
              break;
            case 7:
              $ctx.state = (i < routeLists.length) ? 1 : 5;
              break;
            case 4:
              i++;
              $ctx.state = 7;
              break;
            case 1:
              $ctx.state = 2;
              return routeLists[i].buildRoutes(config, routeIndex);
            case 2:
              $ctx.maybeThrow();
              $ctx.state = 4;
              break;
            case 5:
              $ctx.state = (defaultHandler) ? 8 : 11;
              break;
            case 8:
              $ctx.state = 9;
              return loadDefaultRoute(config, defaultHandler, routeIndex);
            case 9:
              $ctx.maybeThrow();
              $ctx.state = 11;
              break;
            case 11:
              $ctx.returnValue = routerHandleable(routeIndex);
              $ctx.state = -2;
              break;
            default:
              return $ctx.end();
          }
      }, $__12, this);
    }));
  },
  privatize: function(privateInstance, privateTable) {
    privateInstance._routeLists = this._routeLists.map((function(routeList) {
      return routeList.makePrivate(privateTable);
    }));
    privateInstance._defaultRouteList = this._defaultRouteList.makePrivate(privateTable);
    privateInstance._defaultHandler = this._defaultHandler.makePrivate(privateTable);
    $traceurRuntime.superCall(this, $Router.prototype, "privatize", [privateInstance, privateTable]);
  },
  get type() {
    return 'router';
  },
  toJson: function() {
    var json = $traceurRuntime.superCall(this, $Router.prototype, "toJson", []);
    json.routeLists = this.routeLists.map((function(routeList) {
      return routeList.toJson();
    }));
    var defaultHandler = this.defaultHandler;
    if (defaultHandler)
      json.defaultHandler = defaultHandler.toJson();
    json.middlewares = this.middlewareJson();
    return json;
  }
}, {}, ExtensibleHandler);
var routeList = (function(options) {
  return new RouteList(options);
});
var router = (function(options) {
  return new Router(options);
});
