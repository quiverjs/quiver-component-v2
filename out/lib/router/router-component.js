"use strict";
Object.defineProperties(exports, {
  Router: {get: function() {
      return Router;
    }},
  router: {get: function() {
      return router;
    }},
  makeRouter: {get: function() {
      return makeRouter;
    }},
  __esModule: {value: true}
});
var $__quiver_45_object__,
    $__quiver_45_promise__,
    $___46__46__47_util_47_config__,
    $___46__46__47_extensible_45_component__,
    $___46__46__47_component__,
    $___46__46__47_list__,
    $__route_45_list_45_component__,
    $__route_45_specs__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var normalizeConfig = ($___46__46__47_util_47_config__ = require("../util/config"), $___46__46__47_util_47_config__ && $___46__46__47_util_47_config__.__esModule && $___46__46__47_util_47_config__ || {default: $___46__46__47_util_47_config__}).normalizeConfig;
var ExtensibleHandler = ($___46__46__47_extensible_45_component__ = require("../extensible-component"), $___46__46__47_extensible_45_component__ && $___46__46__47_extensible_45_component__.__esModule && $___46__46__47_extensible_45_component__ || {default: $___46__46__47_extensible_45_component__}).ExtensibleHandler;
var $__4 = ($___46__46__47_component__ = require("../component"), $___46__46__47_component__ && $___46__46__47_component__.__esModule && $___46__46__47_component__ || {default: $___46__46__47_component__}),
    Component = $__4.Component,
    HandlerComponent = $__4.HandlerComponent;
var componentList = ($___46__46__47_list__ = require("../list"), $___46__46__47_list__ && $___46__46__47_list__.__esModule && $___46__46__47_list__ || {default: $___46__46__47_list__}).componentList;
var RouteList = ($__route_45_list_45_component__ = require("./route-list-component"), $__route_45_list_45_component__ && $__route_45_list_45_component__.__esModule && $__route_45_list_45_component__ || {default: $__route_45_list_45_component__}).RouteList;
var routeBuildSpecsToRouterBuilder = ($__route_45_specs__ = require("./route-specs"), $__route_45_specs__ && $__route_45_specs__.__esModule && $__route_45_specs__ || {default: $__route_45_specs__}).routeBuildSpecsToRouterBuilder;
var Router = function Router() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  $traceurRuntime.superConstructor($Router).call(this, options);
  this.subComponents.defaultRouteList = new RouteList();
  this.subComponents.routeListList = componentList();
};
var $Router = Router;
($traceurRuntime.createClass)(Router, {
  addRoute: function(route) {
    if (!route.isRoute) {
      throw new TypeError('route must be instance of Route');
    }
    this.defaultRouteList.addRoute(route);
    return this;
  },
  staticRoute: function(path, handler) {
    this.defaultRouteList.staticRoute(path, handler);
    return this;
  },
  paramRoute: function(path, handler) {
    this.defaultRouteList.paramRoute(path, handler);
    return this;
  },
  regexRoute: function(regex, fields, handler) {
    this.defaultRouteList.regexRoute(regex, fields, handler);
    return this;
  },
  dynamicRoute: function(matcher, handler) {
    this.defaultRouteList.dynamicRoute(matcher, handler);
    return this;
  },
  routeList: function(routeList) {
    if (!routeList.isRouteList) {
      throw new TypeError('route list must be instance of RouteList');
    }
    this.routeListList.push(routeList);
    return this;
  },
  get routeLists() {
    return $traceurRuntime.spread([this.defaultRouteList], this.routeListList.array);
  },
  get defaultRouteList() {
    return this.subComponents.defaultRouteList;
  },
  get routeListList() {
    return this.subComponents.routeListList;
  },
  get defaultHandler() {
    return this.subComponents.defaultHandler;
  },
  defaultRoute: function(handlerComponent) {
    if (this.defaultHandler)
      throw new Error('router component already has default route');
    this.subComponents.defaultHandler = handlerComponent;
    return this;
  },
  toMainHandleableBuilder: function() {
    let routeLists = this.routeLists;
    let routeBuildSpecs = [].concat.apply([], routeLists.map((function(routeList) {
      return routeList.toRouteBuildSpecs();
    })));
    let defaultHandler = this.defaultHandler;
    if (defaultHandler) {
      routeBuildSpecs.push({
        routeType: 'default',
        builder: defaultHandler.toHandleableBuilder()
      });
    }
    return routeBuildSpecsToRouterBuilder(routeBuildSpecs);
  },
  get type() {
    return 'router';
  },
  toJson: function() {
    let json = $traceurRuntime.superGet(this, $Router.prototype, "toJson").call(this);
    json.routeLists = this.routeLists.map((function(routeList) {
      return routeList.toJson();
    }));
    let defaultHandler = this.defaultHandler;
    if (defaultHandler)
      json.defaultHandler = defaultHandler.toJson();
    json.middlewares = this.middlewareJson();
    return json;
  }
}, {}, ExtensibleHandler);
let router = (function(options) {
  return new Router(options);
});
let makeRouter = (function(options) {
  return new Router(options);
});
