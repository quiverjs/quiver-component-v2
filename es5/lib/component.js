"use strict";
Object.defineProperties(exports, {
  Component: {get: function() {
      return Component;
    }},
  MiddlewareComponent: {get: function() {
      return MiddlewareComponent;
    }},
  HandlerComponent: {get: function() {
      return HandlerComponent;
    }},
  __esModule: {value: true}
});
var $__util_47_loader__;
var loadHandleable = ($__util_47_loader__ = require("./util/loader"), $__util_47_loader__ && $__util_47_loader__.__esModule && $__util_47_loader__ || {default: $__util_47_loader__}).loadHandleable;
var assertComponent = (function(component) {
  if (!(component instanceof Component)) {
    throw new Error('object must be of type Component');
  }
});
var Component = function Component() {
  var $__4;
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  var $__3 = options,
      name = $__3.name,
      subComponents = ($__4 = $__3.subComponents) === void 0 ? {} : $__4;
  this._name = name;
  this._id = Symbol();
  this._options = options;
  for (var key in subComponents) {
    var component = subComponents[key];
    if (Array.isArray(component)) {
      component.forEach(assertComponent);
    } else {
      assertComponent(component);
    }
  }
  this._subComponents = subComponents;
};
($traceurRuntime.createClass)(Component, {
  get name() {
    return this._name;
  },
  get id() {
    return this._id;
  },
  get type() {
    return 'component';
  },
  get subComponents() {
    return this._subComponents;
  },
  makePrivate: function() {
    var privateTable = arguments[0] !== (void 0) ? arguments[0] : {};
    var original = this;
    var originalId = original.id;
    if (privateTable[originalId])
      return privateTable[originalId];
    var privateId = Symbol();
    var originalProto = original.originalProto ? original.originalProto : original;
    var privateInstance = Object.create(originalProto);
    privateInstance.originalProto = originalProto;
    Object.defineProperty(privateInstance, 'id', {get: function() {
        return privateId;
      }});
    privateTable[originalId] = privateInstance;
    original.privatize(privateInstance, privateTable);
    return privateInstance;
  },
  privatize: function(privateInstance, privateTable) {
    var subComponents = (this).subComponents;
    var newSubComponents = {};
    for (var key in subComponents) {
      var component = subComponents[key];
      if (Array.isArray(component)) {
        newSubComponents[key] = component.map((function(component) {
          return component.makePrivate(privateTable);
        }));
      } else {
        newSubComponents[key] = component.makePrivate(privateTable);
      }
    }
    privateInstance._subComponents = newSubComponents;
  },
  privatizedConstructor: function() {
    var $__1 = this;
    return (function(privateTable) {
      return $__1.makePrivate(privateTable);
    });
  },
  toJson: function() {
    var json = {
      id: this.id.toString(),
      type: this.type
    };
    if (this.name)
      json.name = this.name;
    return json;
  },
  toString: function() {
    return JSON.stringify(this.toJson(), undefined, 2);
  },
  inspect: function() {
    return this.toString();
  }
}, {});
var MiddlewareComponent = function MiddlewareComponent() {
  $traceurRuntime.defaultSuperCall(this, $MiddlewareComponent.prototype, arguments);
};
var $MiddlewareComponent = MiddlewareComponent;
($traceurRuntime.createClass)(MiddlewareComponent, {
  get handleableMiddleware() {
    throw new Error('unimplemented in abstract class');
  },
  addMiddleware: function(MiddlewareComponent) {
    throw new Error('unimplemented in abstract class');
  },
  get type() {
    return 'middleware';
  }
}, {}, Component);
var HandlerComponent = function HandlerComponent() {
  $traceurRuntime.defaultSuperCall(this, $HandlerComponent.prototype, arguments);
};
var $HandlerComponent = HandlerComponent;
($traceurRuntime.createClass)(HandlerComponent, {
  get handleableBuilder() {
    throw new Error('unimplemented in abstract class');
  },
  addMiddleware: function(MiddlewareComponent) {
    throw new Error('unimplemented in abstract class');
  },
  loadHandleable: function(config, options) {
    return loadHandleable(config, this, options);
  },
  loadHandler: function(config, options) {
    return this.handlerLoader(config, this, options);
  },
  get handlerLoader() {
    return loadHandleable;
  },
  get type() {
    return 'handler';
  }
}, {}, Component);
