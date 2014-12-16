"use strict";
Object.defineProperties(exports, {
  RouteList: {get: function() {
      return RouteList;
    }},
  routeList: {get: function() {
      return routeList;
    }},
  __esModule: {value: true}
});
var $___46__46__47_component__,
    $__route_45_component__,
    $___46__46__47_extensible_45_component__,
    $___46__46__47_util_47_middleware__;
var Component = ($___46__46__47_component__ = require("../component"), $___46__46__47_component__ && $___46__46__47_component__.__esModule && $___46__46__47_component__ || {default: $___46__46__47_component__}).Component;
var $__1 = ($__route_45_component__ = require("./route-component"), $__route_45_component__ && $__route_45_component__.__esModule && $__route_45_component__ || {default: $__route_45_component__}),
    Route = $__1.Route,
    StaticRoute = $__1.StaticRoute,
    DynamicRoute = $__1.DynamicRoute,
    RegexRoute = $__1.RegexRoute,
    ParamRoute = $__1.ParamRoute;
var ExtensibleComponent = ($___46__46__47_extensible_45_component__ = require("../extensible-component"), $___46__46__47_extensible_45_component__ && $___46__46__47_extensible_45_component__.__esModule && $___46__46__47_extensible_45_component__ || {default: $___46__46__47_extensible_45_component__}).ExtensibleComponent;
var combineBuilderWithMiddleware = ($___46__46__47_util_47_middleware__ = require("../util/middleware"), $___46__46__47_util_47_middleware__ && $___46__46__47_util_47_middleware__.__esModule && $___46__46__47_util_47_middleware__ || {default: $___46__46__47_util_47_middleware__}).combineBuilderWithMiddleware;
var RouteList = function RouteList() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  this._routes = [];
  $traceurRuntime.superConstructor($RouteList).call(this, options);
};
var $RouteList = RouteList;
($traceurRuntime.createClass)(RouteList, {
  get routes() {
    return this._routes;
  },
  toRouteBuildSpecs: function() {
    var middleware = this.toExtendMiddleware();
    return this.routes.map((function(route) {
      var builder = route.toHandleableBuilder();
      var routeSpec = route.routeSpec;
      routeSpec.builder = combineBuilderWithMiddleware(builder, middleware);
      return routeSpec;
    }));
  },
  addRoute: function(route) {
    if (!route.isRoute) {
      throw new Error('route must be of type Route');
    }
    this._routes.push(route);
    return this;
  },
  staticRoute: function(path, handler) {
    return this.addRoute(new StaticRoute(handler, path));
  },
  paramRoute: function(path, handler) {
    return this.addRoute(new ParamRoute(handler, path));
  },
  regexRoute: function(regex, fields, handler) {
    return this.addRoute(new RegexRoute(handler, regex, fields));
  },
  dynamicRoute: function(matcher, handler) {
    return this.addRoute(new DynamicRoute(handler, matcher));
  },
  doFork: function(forkedInstance, forkTable) {
    forkedInstance._routes = this._routes.map((function(route) {
      return route.fork(forkTable);
    }));
    $traceurRuntime.superGet(this, $RouteList.prototype, "doFork").call(this, forkedInstance, forkTable);
  },
  get type() {
    return 'route list';
  },
  get isRouteList() {
    return true;
  },
  toJson: function() {
    var json = $traceurRuntime.superGet(this, $RouteList.prototype, "toJson").call(this);
    var routes = this.routes;
    if (routes.length > 0)
      json.routes = this.routes.map((function(route) {
        return route.toJson();
      }));
    json.middlewares = this.middlewareJson();
    return json;
  }
}, {}, ExtensibleComponent);
var routeList = (function(options) {
  return new RouteList(options);
});
