"use strict";
Object.defineProperties(exports, {
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
var combineUrlBuilders = (function(urlBuilder1, urlBuilder2) {
  if (!urlBuilder1 || !urlBuilder2)
    return null;
  return (function(args) {
    var restPath = arguments[1] !== (void 0) ? arguments[1] : '/';
    var newRestPath = urlBuilder2(args, restPath);
    return urlBuilder1(args, newRestPath);
  });
});
var urlMiddleware = (function(urlBuilder) {
  return async($traceurRuntime.initGeneratorFunction(function $__8(config, builder) {
    var newUrlBuilder,
        handleable;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            newUrlBuilder = config.urlBuilder = combineUrlBuilders(config.urlBuilder, urlBuilder);
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 2;
            return builder(config);
          case 2:
            handleable = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            if (!handleable.urlBuilder) {
              handleable.urlBuilder = newUrlBuilder;
            }
            $ctx.state = 10;
            break;
          case 10:
            $ctx.returnValue = handleable;
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__8, this);
  }));
});
var routeBuilder = (function(component, urlBuilder, middleware) {
  var mainBuilder = component.handleableBuilder;
  var middlewares = [];
  if (urlBuilder) {
    middlewares.push(urlMiddleware(urlBuilder));
  }
  middlewares.push(middleware);
  return combineBuilderWithMiddlewares(mainBuilder, middlewares);
});
var Route = function Route(handlerComponent) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  if (!(handlerComponent instanceof HandlerComponent)) {
    handlerComponent = new MethodRouter(handlerComponent);
  }
  var urlBuilder = options.urlBuilder;
  this._urlBuilder = urlBuilder;
  $traceurRuntime.superCall(this, $Route.prototype, "constructor", [options]);
  this.subComponents.routeHandler = handlerComponent;
};
var $Route = Route;
($traceurRuntime.createClass)(Route, {
  get handleableBuilder() {
    var mainBuilder = this.handlerComponent.handleableBuilder;
    var urlBuilder = this.urlBuilder;
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
  toJson: function() {
    var json = $traceurRuntime.superCall(this, $Route.prototype, "toJson", []);
    json.handler = this.handlerComponent.toJson();
    return json;
  }
}, {}, Component);
var StaticRoute = function StaticRoute(handlerComponent, staticPath) {
  var options = arguments[2] !== (void 0) ? arguments[2] : {};
  if (typeof(staticPath) != 'string')
    throw new TypeError('staticPath must be provided as string');
  this._staticPath = staticPath;
  var urlBuilder = (function() {
    return staticPath;
  });
  options.urlBuilder = options.urlBuilder || urlBuilder;
  $traceurRuntime.superCall(this, $StaticRoute.prototype, "constructor", [handlerComponent, options]);
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
    var json = $traceurRuntime.superCall(this, $StaticRoute.prototype, "toJson", []);
    json.staticPath = this.staticPath;
    return json;
  }
}, {}, Route);
var DynamicRoute = function DynamicRoute(handlerComponent, matcher) {
  var options = arguments[2] !== (void 0) ? arguments[2] : {};
  if (typeof(matcher) != 'function')
    throw new TypeError('matcher must be of type function');
  this._matcher = matcher;
  $traceurRuntime.superCall(this, $DynamicRoute.prototype, "constructor", [handlerComponent, options]);
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
  var matcher = regexMatcher(regex, matchFields);
  $traceurRuntime.superCall(this, $RegexRoute.prototype, "constructor", [handlerComponent, matcher, options]);
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
  var matcher = paramMatcher(paramPath);
  options.urlBuilder = options.urlBuilder || paramUrlBuilder(paramPath);
  $traceurRuntime.superCall(this, $ParamRoute.prototype, "constructor", [handlerComponent, matcher, options]);
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
    var json = $traceurRuntime.superCall(this, $ParamRoute.prototype, "toJson", []);
    json.paramPath = this.paramPath;
    return json;
  }
}, {}, DynamicRoute);
var staticRoute = (function(handler, path, options) {
  return new StaticRoute(handler, path, options);
});
var dynamicRoute = (function(handler, matcher, options) {
  return new DynamicRoute(handler, matcher, options);
});
var regexRoute = (function(handler, regex, fields, options) {
  return new RegexRoute(handler, regex, fields, options);
});
var paramRoute = (function(handler, path, options) {
  return new ParamRoute(handler, path, options);
});
