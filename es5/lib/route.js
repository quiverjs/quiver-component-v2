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
var $__util_47_url_46_js__,
    $__component_46_js__,
    $__util_47_route_46_js__;
var urlManagedBuilder = ($__util_47_url_46_js__ = require("./util/url.js"), $__util_47_url_46_js__ && $__util_47_url_46_js__.__esModule && $__util_47_url_46_js__ || {default: $__util_47_url_46_js__}).urlManagedBuilder;
var $__1 = ($__component_46_js__ = require("./component.js"), $__component_46_js__ && $__component_46_js__.__esModule && $__component_46_js__ || {default: $__component_46_js__}),
    Component = $__1.Component,
    HandlerComponent = $__1.HandlerComponent;
var $__2 = ($__util_47_route_46_js__ = require("./util/route.js"), $__util_47_route_46_js__ && $__util_47_route_46_js__.__esModule && $__util_47_route_46_js__ || {default: $__util_47_route_46_js__}),
    regexMatcher = $__2.regexMatcher,
    paramMatcher = $__2.paramMatcher,
    paramUrlBuilder = $__2.paramUrlBuilder;
var Route = function Route(handlerComponent) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  if (!(handlerComponent instanceof HandlerComponent))
    throw new TypeError('input handler component must be of type HandlerComponent');
  this._handlerComponent = handlerComponent;
  var urlBuilder = options.urlBuilder;
  this._urlBuilder = urlBuilder;
};
var $Route = Route;
($traceurRuntime.createClass)(Route, {
  get handleableBuilder() {
    var handlerComponent = this.handlerComponent;
    var urlBuilder = this.urlBuilder;
    return urlManagedBuilder(handlerComponent, urlBuilder);
  },
  get handlerComponent() {
    return this._handlerComponent;
  },
  privatize: function(privateInstance, privateTable) {
    privateInstance._handlerComponent = this._handlerComponent.makePrivate(privateTable);
    $traceurRuntime.superCall(this, $Route.prototype, "privatize", [privateInstance, privateTable]);
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
  if (!(handlerComponent instanceof HandlerComponent))
    throw new TypeError('handler must be of type HandlerComponent');
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
    routeIndex.addStaticRoute(this.staticPath, handler);
  },
  get staticPath() {
    return this._staticPath;
  },
  get type() {
    return 'static route';
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
  addRoute: function(routeIndex, handler) {
    routeIndex.addDynamicRoute(this.matcher, handler);
  },
  get matcher() {
    return this._matcher;
  },
  get type() {
    return 'dynamic route';
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
