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
  copy: function() {
    var originalProto = this.originalProto ? this.originalProto : this;
    var newInstance = Object.create(originalProto);
    newInstance.originalProto = originalProto;
    var privateId = Symbol();
    Object.defineProperty(newInstance, 'id', {get: function() {
        return privateId;
      }});
    return newInstance;
  },
  map: function(mapper) {
    var copy = this.copy();
    this.doMap(copy, mapper);
    return copy;
  },
  each: function(iteratee) {
    var subComponents = (this).subComponents;
    for (var key in subComponents) {
      iteratee(subComponents[key]);
    }
  },
  doMap: function(target, mapper) {
    var subComponents = (this).subComponents;
    var newSubComponents = {};
    for (var key in subComponents) {
      var component = subComponents[key];
      newSubComponents[key] = mapper(component);
    }
    target._subComponents = newSubComponents;
  },
  factory: function() {
    var $__1 = this;
    return (function() {
      var forkTable = arguments[0] !== (void 0) ? arguments[0] : {};
      return $__1.fork(forkTable);
    });
  },
  fork: function() {
    var forkTable = arguments[0] !== (void 0) ? arguments[0] : {};
    var originalId = this.id;
    if (forkTable[originalId]) {
      return forkTable[originalId];
    }
    var forkedInstance = this.copy();
    forkTable[originalId] = forkedInstance;
    this.doMap(forkedInstance, (function(component) {
      return component.fork(forkTable);
    }));
    return forkedInstance;
  },
  implement: function(componentMap) {
    this.each((function(component) {
      return component.implement(componentMap);
    }));
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
