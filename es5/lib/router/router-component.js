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
    $__route_45_list_45_component__,
    $__route_45_specs__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var normalizeConfig = ($___46__46__47_util_47_config__ = require("../util/config"), $___46__46__47_util_47_config__ && $___46__46__47_util_47_config__.__esModule && $___46__46__47_util_47_config__ || {default: $___46__46__47_util_47_config__}).normalizeConfig;
var ExtensibleHandler = ($___46__46__47_extensible_45_component__ = require("../extensible-component"), $___46__46__47_extensible_45_component__ && $___46__46__47_extensible_45_component__.__esModule && $___46__46__47_extensible_45_component__ || {default: $___46__46__47_extensible_45_component__}).ExtensibleHandler;
var $__4 = ($___46__46__47_component__ = require("../component"), $___46__46__47_component__ && $___46__46__47_component__.__esModule && $___46__46__47_component__ || {default: $___46__46__47_component__}),
    Component = $__4.Component,
    HandlerComponent = $__4.HandlerComponent;
var RouteList = ($__route_45_list_45_component__ = require("./route-list-component"), $__route_45_list_45_component__ && $__route_45_list_45_component__.__esModule && $__route_45_list_45_component__ || {default: $__route_45_list_45_component__}).RouteList;
var routeBuildSpecsToRouterBuilder = ($__route_45_specs__ = require("./route-specs"), $__route_45_specs__ && $__route_45_specs__.__esModule && $__route_45_specs__ || {default: $__route_45_specs__}).routeBuildSpecsToRouterBuilder;
var Router = function Router() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  this._routeLists = [];
  this._defaultRouteList = new RouteList();
  $traceurRuntime.superConstructor($Router).call(this, options);
};
var $Router = Router;
($traceurRuntime.createClass)(Router, {
  addRoute: function(route) {
    if (!route.isRoute) {
      throw new TypeError('route must be instance of Route');
    }
    this._defaultRouteList.addRoute(route);
    return this;
  },
  staticRoute: function(path, handler) {
    this._defaultRouteList.staticRoute(path, handler);
    return this;
  },
  paramRoute: function(path, handler) {
    this._defaultRouteList.paramRoute(path, handler);
    return this;
  },
  regexRoute: function(regex, fields, handler) {
    this._defaultRouteList.regexRoute(regex, fields, handler);
    return this;
  },
  dynamicRoute: function(matcher, handler) {
    this._defaultRouteList.dynamicRoute(matcher, handler);
    return this;
  },
  routeList: function(routeList) {
    if (!routeList.isRouteList) {
      throw new TypeError('route list must be instance of RouteList');
    }
    this._routeLists.push(routeList);
    return this;
  },
  get routeLists() {
    return $traceurRuntime.spread([this._defaultRouteList], this._routeLists);
  },
  get defaultHandler() {
    return this._defaultHandler;
  },
  defaultRoute: function(handlerComponent) {
    if (this._defaultHandler)
      throw new Error('router component already has default route');
    this._defaultHandler = handlerComponent;
    return this;
  },
  toMainHandleableBuilder: function() {
    var routeLists = this.routeLists;
    var routeBuildSpecs = [].concat.apply([], routeLists.map((function(routeList) {
      return routeList.toRouteBuildSpecs();
    })));
    var defaultHandler = this.defaultHandler;
    if (defaultHandler) {
      routeBuildSpecs.push({
        routeType: 'default',
        builder: defaultHandler.toHandleableBuilder()
      });
    }
    return routeBuildSpecsToRouterBuilder(routeBuildSpecs);
  },
  doFork: function(forkedInstance, forkTable) {
    forkedInstance._routeLists = this._routeLists.map((function(routeList) {
      return routeList.doFork(forkTable);
    }));
    forkedInstance._defaultRouteList = this._defaultRouteList.doFork(forkTable);
    forkedInstance._defaultHandler = this._defaultHandler.doFork(forkTable);
    $traceurRuntime.superGet(this, $Router.prototype, "doFork").call(this, forkedInstance, forkTable);
  },
  get type() {
    return 'router';
  },
  toJson: function() {
    var json = $traceurRuntime.superGet(this, $Router.prototype, "toJson").call(this);
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
var router = (function(options) {
  return new Router(options);
});
var makeRouter = (function(options) {
  return new Router(options);
});
