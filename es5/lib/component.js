"use strict";
Object.defineProperties(exports, {
  Component: {get: function() {
      return Component;
    }},
  __esModule: {value: true}
});
var $__util_47_loader__;
var loadHandleable = ($__util_47_loader__ = require("./util/loader"), $__util_47_loader__ && $__util_47_loader__.__esModule && $__util_47_loader__ || {default: $__util_47_loader__}).loadHandleable;
var assertComponent = (function(component) {
  if (!component.isQuiverComponent) {
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
    assertComponent(component);
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
  get isQuiverComponent() {
    return true;
  },
  get subComponents() {
    return this._subComponents;
  },
  fork: function() {
    var forkTable = arguments[0] !== (void 0) ? arguments[0] : {};
    var original = this;
    var originalId = original.id;
    if (forkTable[originalId]) {
      return forkTable[originalId];
    }
    var privateId = Symbol();
    var originalProto = original.originalProto ? original.originalProto : original;
    var forkedInstance = Object.create(originalProto);
    forkedInstance.originalProto = originalProto;
    Object.defineProperty(forkedInstance, 'id', {get: function() {
        return privateId;
      }});
    forkTable[originalId] = forkedInstance;
    original.doFork(forkedInstance, forkTable);
    return forkedInstance;
  },
  doFork: function(forkedInstance, forkTable) {
    var subComponents = (this).subComponents;
    var newSubComponents = {};
    for (var key in subComponents) {
      var component = subComponents[key];
      newSubComponents[key] = component.fork(forkTable);
    }
    forkedInstance._subComponents = newSubComponents;
  },
  toTemplate: function() {
    var $__1 = this;
    return (function() {
      return $__1.fork({});
    });
  },
  implement: function(componentMap) {
    var subComponents = (this).subComponents;
    for (var key in subComponents) {
      subComponents[key].implement(componentMap);
    }
  },
  toJson: function() {
    var json = {
      id: this.id.toString(),
      type: this.type
    };
    if (this.name) {
      json.name = this.name;
    }
    return json;
  },
  toString: function() {
    return JSON.stringify(this.toJson(), undefined, 2);
  },
  inspect: function() {
    return this.toString();
  }
}, {});
