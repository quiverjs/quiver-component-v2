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
var $__2 = $traceurRuntime.assertObject(require('./route.js')),
    Route = $__2.Route,
    StaticRoute = $__2.StaticRoute,
    DynamicRoute = $__2.DynamicRoute,
    RegexRoute = $__2.RegexRoute,
    ParamRoute = $__2.ParamRoute;
var routerHandleable = $traceurRuntime.assertObject(require('./util/router.js')).routerHandleable;
var createRouteIndex = $traceurRuntime.assertObject(require('./util/route-index.js')).createRouteIndex;
var $__2 = $traceurRuntime.assertObject(require('./component.js')),
    Component = $__2.Component,
    HandlerComponent = $__2.HandlerComponent;
var mixinMiddlewareExtensible = $traceurRuntime.assertObject(require('./extend-middleware.js')).mixinMiddlewareExtensible;
var ExtensibleHandler = $traceurRuntime.assertObject(require('./extensible-component.js')).ExtensibleHandler;
var $__2 = $traceurRuntime.assertObject(require('./util/middleware.js')),
    combineMiddlewareComponents = $__2.combineMiddlewareComponents,
    combineBuilderMiddleware = $__2.combineBuilderMiddleware,
    combineBuilderWithMiddleware = $__2.combineBuilderWithMiddleware;
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var RouteList = function RouteList() {
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  this._routes = [];
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
mixinMiddlewareExtensible(RouteList);
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
    var $__0 = this;
    var routeLists = this.routeLists;
    return (function(config) {
      var routeIndex = createRouteIndex();
      var promises = routeLists.map((function(routeList) {
        return routeList.buildRoutes(config, routeIndex);
      }));
      var defaultHandler = $__0.defaultHandler;
      if (defaultHandler) {
        promises.push(loadDefaultRoute(config, defaultHandler, routeIndex));
      }
      return Promise.all(promises).then((function() {
        return routerHandleable(routeIndex);
      }));
    });
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
