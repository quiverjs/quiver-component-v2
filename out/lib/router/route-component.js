"use strict";
Object.defineProperties(module.exports, {
  Route: {get: function() {
      return Route;
    }},
  StaticRoute: {get: function() {
      return StaticRoute;
    }},
  DynamicRoute: {get: function() {
      return DynamicRoute;
    }},
  RegexRoute: {get: function() {
      return RegexRoute;
    }},
  ParamRoute: {get: function() {
      return ParamRoute;
    }},
  staticRoute: {get: function() {
      return staticRoute;
    }},
  dynamicRoute: {get: function() {
      return dynamicRoute;
    }},
  regexRoute: {get: function() {
      return regexRoute;
    }},
  paramRoute: {get: function() {
      return paramRoute;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__,
    $___46__46__47_util_47_loader__,
    $___46__46__47_util_47_middleware__,
    $___46__46__47_component__,
    $__method_45_router__,
    $__dynamic_45_route__;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var loadHandleable = ($___46__46__47_util_47_loader__ = require("../util/loader"), $___46__46__47_util_47_loader__ && $___46__46__47_util_47_loader__.__esModule && $___46__46__47_util_47_loader__ || {default: $___46__46__47_util_47_loader__}).loadHandleable;
var combineBuilderWithMiddleware = ($___46__46__47_util_47_middleware__ = require("../util/middleware"), $___46__46__47_util_47_middleware__ && $___46__46__47_util_47_middleware__.__esModule && $___46__46__47_util_47_middleware__ || {default: $___46__46__47_util_47_middleware__}).combineBuilderWithMiddleware;
var $__3 = ($___46__46__47_component__ = require("../component"), $___46__46__47_component__ && $___46__46__47_component__.__esModule && $___46__46__47_component__ || {default: $___46__46__47_component__}),
    Component = $__3.Component,
    HandlerComponent = $__3.HandlerComponent;
var MethodRouter = ($__method_45_router__ = require("./method-router"), $__method_45_router__ && $__method_45_router__.__esModule && $__method_45_router__ || {default: $__method_45_router__}).MethodRouter;
var $__5 = ($__dynamic_45_route__ = require("./dynamic-route"), $__dynamic_45_route__ && $__dynamic_45_route__.__esModule && $__dynamic_45_route__ || {default: $__dynamic_45_route__}),
    regexMatcher = $__5.regexMatcher,
    paramMatcher = $__5.paramMatcher,
    paramUrlBuilder = $__5.paramUrlBuilder;
let combineUrlBuilders = (function(urlBuilder1, urlBuilder2) {
  if (!urlBuilder1 || !urlBuilder2)
    return null;
  return (function(args) {
    var restPath = arguments[1] !== (void 0) ? arguments[1] : '/';
    let newRestPath = urlBuilder2(args, restPath);
    return urlBuilder1(args, newRestPath);
  });
});
let urlMiddleware = (function(urlBuilder) {
  return async(function*(config, builder) {
    let newUrlBuilder = config.urlBuilder = combineUrlBuilders(config.urlBuilder, urlBuilder);
    let handleable = yield builder(config);
    if (!handleable.urlBuilder) {
      handleable.urlBuilder = newUrlBuilder;
    }
    return handleable;
  });
});
let routeBuilder = (function(component, urlBuilder, middleware) {
  let mainBuilder = component.toHandleableBuilder();
  let middlewares = [];
  if (urlBuilder) {
    middlewares.push(urlMiddleware(urlBuilder));
  }
  middlewares.push(middleware);
  return combineBuilderWithMiddlewares(mainBuilder, middlewares);
});
var Route = function Route(handlerComponent) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  if (!handlerComponent.isHandlerComponent) {
    handlerComponent = new MethodRouter(handlerComponent);
  }
  let urlBuilder = options.urlBuilder;
  this._urlBuilder = urlBuilder;
  $traceurRuntime.superConstructor($Route).call(this, options);
  this.subComponents.routeHandler = handlerComponent;
};
var $Route = Route;
($traceurRuntime.createClass)(Route, {
  toHandleableBuilder: function() {
    let mainBuilder = this.handlerComponent.toHandleableBuilder();
    let urlBuilder = this.urlBuilder;
    if (urlBuilder) {
      return combineBuilderWithMiddleware(mainBuilder, urlMiddleware(urlBuilder));
    } else {
      return mainBuilder;
    }
  },
  get routeSpec() {
    throw new Error('unimplemented');
  },
  get handlerComponent() {
    return this.subComponents.routeHandler;
  },
  get urlBuilder() {
    return this._urlBuilder;
  },
  get type() {
    return 'route';
  },
  get isRoute() {
    return true;
  },
  toJson: function() {
    let json = $traceurRuntime.superGet(this, $Route.prototype, "toJson").call(this);
    json.handler = this.handlerComponent.toJson();
    return json;
  }
}, {}, Component);
var StaticRoute = function StaticRoute(handlerComponent, staticPath) {
  var options = arguments[2] !== (void 0) ? arguments[2] : {};
  if (typeof(staticPath) != 'string')
    throw new TypeError('staticPath must be provided as string');
  this._staticPath = staticPath;
  let urlBuilder = (function() {
    return staticPath;
  });
  options.urlBuilder = options.urlBuilder || urlBuilder;
  $traceurRuntime.superConstructor($StaticRoute).call(this, handlerComponent, options);
};
var $StaticRoute = StaticRoute;
($traceurRuntime.createClass)(StaticRoute, {
  get routeSpec() {
    return {
      routeType: 'static',
      path: this.staticPath
    };
  },
  get staticPath() {
    return this._staticPath;
  },
  get type() {
    return 'static route';
  },
  get routeType() {
    return 'static';
  },
  toJson: function() {
    let json = $traceurRuntime.superGet(this, $StaticRoute.prototype, "toJson").call(this);
    json.staticPath = this.staticPath;
    return json;
  }
}, {}, Route);
var DynamicRoute = function DynamicRoute(handlerComponent, matcher) {
  var options = arguments[2] !== (void 0) ? arguments[2] : {};
  if (typeof(matcher) != 'function')
    throw new TypeError('matcher must be of type function');
  this._matcher = matcher;
  $traceurRuntime.superConstructor($DynamicRoute).call(this, handlerComponent, options);
};
var $DynamicRoute = DynamicRoute;
($traceurRuntime.createClass)(DynamicRoute, {
  get routeSpec() {
    return {
      routeType: 'dynamic',
      matcher: this.matcher
    };
  },
  get matcher() {
    return this._matcher;
  },
  get type() {
    return 'dynamic route';
  },
  get routeType() {
    return 'dynamic';
  }
}, {}, Route);
var RegexRoute = function RegexRoute(handlerComponent, regex) {
  var matchFields = arguments[2] !== (void 0) ? arguments[2] : [];
  var options = arguments[3] !== (void 0) ? arguments[3] : {};
  if (!(regex instanceof RegExp))
    throw new TypeError('regex must be regular expression');
  this._regex = regex;
  let matcher = regexMatcher(regex, matchFields);
  $traceurRuntime.superConstructor($RegexRoute).call(this, handlerComponent, matcher, options);
};
var $RegexRoute = RegexRoute;
($traceurRuntime.createClass)(RegexRoute, {
  get regex() {
    return this._regex;
  },
  get type() {
    return 'regex route';
  }
}, {}, DynamicRoute);
var ParamRoute = function ParamRoute(handlerComponent, paramPath) {
  var options = arguments[2] !== (void 0) ? arguments[2] : {};
  if (typeof(paramPath) != 'string')
    throw new TypeError('param path must be of type string');
  this._paramPath = paramPath;
  let matcher = paramMatcher(paramPath);
  options.urlBuilder = options.urlBuilder || paramUrlBuilder(paramPath);
  $traceurRuntime.superConstructor($ParamRoute).call(this, handlerComponent, matcher, options);
};
var $ParamRoute = ParamRoute;
($traceurRuntime.createClass)(ParamRoute, {
  get paramPath() {
    return this._paramPath;
  },
  get type() {
    return 'param route';
  },
  toJson: function() {
    let json = $traceurRuntime.superGet(this, $ParamRoute.prototype, "toJson").call(this);
    json.paramPath = this.paramPath;
    return json;
  }
}, {}, DynamicRoute);
let staticRoute = (function(handler, path, options) {
  return new StaticRoute(handler, path, options);
});
let dynamicRoute = (function(handler, matcher, options) {
  return new DynamicRoute(handler, matcher, options);
});
let regexRoute = (function(handler, regex, fields, options) {
  return new RegexRoute(handler, regex, fields, options);
});
let paramRoute = (function(handler, path, options) {
  return new ParamRoute(handler, path, options);
});
