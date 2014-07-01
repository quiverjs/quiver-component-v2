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
  __esModule: {value: true}
});
var HandlerComponent = $traceurRuntime.assertObject(require('./handler.js')).HandlerComponent;
var urlManagedBuilder = $traceurRuntime.assertObject(require('./util/url.js')).urlManagedBuilder;
var $__1 = $traceurRuntime.assertObject(require('quiver-router')),
    createRegexRouteMatcher = $__1.createRegexRouteMatcher,
    createParamRouteMatcher = $__1.createParamRouteMatcher,
    createParamurlBuilder = $__1.createParamurlBuilder;
var Route = function Route(handlerComponent, options) {
  if (!(handlerComponent instanceof HandlerComponent))
    throw new TypeError('input handler component must be of type HandlerComponent');
  this._handlerComponent = handlerComponent;
  var urlBuilder = $traceurRuntime.assertObject(options).urlBuilder;
  this._urlBuilder = urlBuilder;
};
($traceurRuntime.createClass)(Route, {
  get handleableBuilder() {
    var handlerComponent = this.handlerComponent;
    var builder = handlerComponent.handleableBuilder;
    var urlBuilder = this.urlBuilder;
    return urlManagedBuilder(builder, urlBuilder);
  },
  get handlerComponent() {
    return this._handlerComponent;
  },
  get urlBuilder() {
    return this._urlBuilder;
  }
}, {}, Component);
var StaticRoute = function StaticRoute(handlerComponent, staticPath, options) {
  if (typeof(staticPath) != 'string')
    throw new TypeError('staticPath must be provided as string');
  this._staticPath = staticPath;
  var staticUrlBuilder = (function() {
    return staticPath;
  });
  options.urlBuilder = options.urlBuilder || staticUrlBuilder;
  $traceurRuntime.superCall(this, $StaticRoute.prototype, "constructor", [handlerComponent, options]);
};
var $StaticRoute = StaticRoute;
($traceurRuntime.createClass)(StaticRoute, {
  addRoute: function(routeIndex, handler) {
    routeIndex.addStaticRoute(handler, this.staticPath);
  },
  get staticPath() {
    return this._staticPath;
  }
}, {}, Route);
var DynamicRoute = function DynamicRoute(handlerComponent, matcher, options) {
  if (typeof(matcher) != 'function')
    throw new TypeError('matcher must be of type function');
  this._matcher = matcher;
  $traceurRuntime.superCall(this, $DynamicRoute.prototype, "constructor", [handlerComponent, options]);
};
var $DynamicRoute = DynamicRoute;
($traceurRuntime.createClass)(DynamicRoute, {
  addRoute: function(routeIndex, handler) {
    routeIndex.addDynamicRoute(handler, this.matcher);
  },
  get matcher() {
    return this._matcher;
  }
}, {}, Route);
var RegexRoute = function RegexRoute(handlerComponent, regex, options) {
  if (!(regex, instance, of, RegExp))
    throw new TypeError('regex must be regular expression');
  this._regex = regex;
  var matcher = createRegexRouteMatcher(regex);
  $traceurRuntime.superCall(this, $RegexRoute.prototype, "constructor", [handlerComponent, matcher, options]);
};
var $RegexRoute = RegexRoute;
($traceurRuntime.createClass)(RegexRoute, {get regex() {
    return this._regex;
  }}, {}, DynamicRoute);
var ParamRoute = function ParamRoute(handlerComponent, paramPath, options) {
  if (tyeof(paramPath) != 'string')
    throw new TypeError('param path must be of type string');
  this._paramPath = paramPath;
  var matcher = createParamRouteMatcher(paramPath);
  options.urlBuilder = options.urlBuilder || createParamUrlBuilder(paramPath);
  $traceurRuntime.superCall(this, $ParamRoute.prototype, "constructor", [handlerComponent, matcher, options]);
};
var $ParamRoute = ParamRoute;
($traceurRuntime.createClass)(ParamRoute, {get paramPath() {
    return this._paramPath;
  }}, {}, RegexRoute);
