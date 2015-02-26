"use strict";
Object.defineProperties(module.exports, {
  RouteList: {get: function() {
      return RouteList;
    }},
  routeList: {get: function() {
      return routeList;
    }},
  __esModule: {value: true}
});
var $___46__46__47_component__,
    $___46__46__47_composite_47_list__,
    $__route_45_component__,
    $___46__46__47_extensible_45_component__,
    $___46__46__47_util_47_middleware__;
var Component = ($___46__46__47_component__ = require("../component"), $___46__46__47_component__ && $___46__46__47_component__.__esModule && $___46__46__47_component__ || {default: $___46__46__47_component__}).Component;
var listComponent = ($___46__46__47_composite_47_list__ = require("../composite/list"), $___46__46__47_composite_47_list__ && $___46__46__47_composite_47_list__.__esModule && $___46__46__47_composite_47_list__ || {default: $___46__46__47_composite_47_list__}).listComponent;
var $__2 = ($__route_45_component__ = require("./route-component"), $__route_45_component__ && $__route_45_component__.__esModule && $__route_45_component__ || {default: $__route_45_component__}),
    Route = $__2.Route,
    StaticRoute = $__2.StaticRoute,
    DynamicRoute = $__2.DynamicRoute,
    RegexRoute = $__2.RegexRoute,
    ParamRoute = $__2.ParamRoute;
var ExtensibleComponent = ($___46__46__47_extensible_45_component__ = require("../extensible-component"), $___46__46__47_extensible_45_component__ && $___46__46__47_extensible_45_component__.__esModule && $___46__46__47_extensible_45_component__ || {default: $___46__46__47_extensible_45_component__}).ExtensibleComponent;
var combineBuilderWithMiddleware = ($___46__46__47_util_47_middleware__ = require("../util/middleware"), $___46__46__47_util_47_middleware__ && $___46__46__47_util_47_middleware__.__esModule && $___46__46__47_util_47_middleware__ || {default: $___46__46__47_util_47_middleware__}).combineBuilderWithMiddleware;
var RouteList = function RouteList() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  $traceurRuntime.superConstructor($RouteList).call(this, options);
  this.subComponents.routeList = listComponent();
};
var $RouteList = RouteList;
($traceurRuntime.createClass)(RouteList, {
  get routes() {
    return this.subComponents.routeList.array;
  },
  toRouteBuildSpecs: function() {
    let middleware = this.toExtendMiddleware();
    return this.routes.map((function(route) {
      let builder = route.toHandleableBuilder();
      let routeSpec = route.routeSpec;
      routeSpec.builder = combineBuilderWithMiddleware(builder, middleware);
      return routeSpec;
    }));
  },
  addRoute: function(route) {
    if (!route.isRoute) {
      throw new Error('route must be of type Route');
    }
    this.routes.push(route);
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
  get type() {
    return 'route list';
  },
  get isRouteList() {
    return true;
  },
  toJson: function() {
    let json = $traceurRuntime.superGet(this, $RouteList.prototype, "toJson").call(this);
    let routes = this.routes;
    if (routes.length > 0)
      json.routes = this.routes.map((function(route) {
        return route.toJson();
      }));
    json.middlewares = this.middlewareJson();
    return json;
  }
}, {}, ExtensibleComponent);
let routeList = (function(options) {
  return new RouteList(options);
});
