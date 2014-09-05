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
var $__route_46_js__,
    $__util_47_router_46_js__,
    $__util_47_route_45_index_46_js__,
    $__component_46_js__,
    $__mixin_45_middleware_46_js__,
    $__extensible_45_component_46_js__,
    $__util_47_middleware_46_js__,
    $__quiver_45_object__;
var $__0 = ($__route_46_js__ = require("./route.js"), $__route_46_js__ && $__route_46_js__.__esModule && $__route_46_js__ || {default: $__route_46_js__}),
    Route = $__0.Route,
    StaticRoute = $__0.StaticRoute,
    DynamicRoute = $__0.DynamicRoute,
    RegexRoute = $__0.RegexRoute,
    ParamRoute = $__0.ParamRoute;
var routerHandleable = ($__util_47_router_46_js__ = require("./util/router.js"), $__util_47_router_46_js__ && $__util_47_router_46_js__.__esModule && $__util_47_router_46_js__ || {default: $__util_47_router_46_js__}).routerHandleable;
var createRouteIndex = ($__util_47_route_45_index_46_js__ = require("./util/route-index.js"), $__util_47_route_45_index_46_js__ && $__util_47_route_45_index_46_js__.__esModule && $__util_47_route_45_index_46_js__ || {default: $__util_47_route_45_index_46_js__}).createRouteIndex;
var $__3 = ($__component_46_js__ = require("./component.js"), $__component_46_js__ && $__component_46_js__.__esModule && $__component_46_js__ || {default: $__component_46_js__}),
    Component = $__3.Component,
    HandlerComponent = $__3.HandlerComponent;
var mixinMiddlewareExtensible = ($__mixin_45_middleware_46_js__ = require("./mixin-middleware.js"), $__mixin_45_middleware_46_js__ && $__mixin_45_middleware_46_js__.__esModule && $__mixin_45_middleware_46_js__ || {default: $__mixin_45_middleware_46_js__}).mixinMiddlewareExtensible;
var ExtensibleHandler = ($__extensible_45_component_46_js__ = require("./extensible-component.js"), $__extensible_45_component_46_js__ && $__extensible_45_component_46_js__.__esModule && $__extensible_45_component_46_js__ || {default: $__extensible_45_component_46_js__}).ExtensibleHandler;
var $__6 = ($__util_47_middleware_46_js__ = require("./util/middleware.js"), $__util_47_middleware_46_js__ && $__util_47_middleware_46_js__.__esModule && $__util_47_middleware_46_js__ || {default: $__util_47_middleware_46_js__}),
    combineMiddlewareComponents = $__6.combineMiddlewareComponents,
    combineBuilderMiddleware = $__6.combineBuilderMiddleware,
    combineBuilderWithMiddleware = $__6.combineBuilderWithMiddleware;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
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
    var promises = this.routes.map((function(route) {
      var component = route.handlerComponent;
      var builder = route.handleableBuilder;
      return middleware(copy(config), builder).then((function(handleable) {
        return route.addRoute(routeIndex, handleable);
      }));
    }));
    return Promise.all(promises);
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
  return component.loadHandleable(copy(config)).then((function(handleable) {
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
    var $__8 = this;
    var routeLists = this.routeLists;
    return (function(config) {
      var routeIndex = createRouteIndex();
      var promises = routeLists.map((function(routeList) {
        return routeList.buildRoutes(config, routeIndex);
      }));
      var defaultHandler = $__8.defaultHandler;
      if (defaultHandler) {
        promises.push(loadDefaultRoute(config, defaultHandler, routeIndex));
      }
      return Promise.all(promises).then((function() {
        return routerHandleable(routeIndex);
      }));
    });
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
