"use strict";
Object.defineProperties(exports, {
  Component: {get: function() {
      return Component;
    }},
  __esModule: {value: true}
});
var $__util_47_loader__;
var loadHandleable = ($__util_47_loader__ = require("./util/loader"), $__util_47_loader__ && $__util_47_loader__.__esModule && $__util_47_loader__ || {default: $__util_47_loader__}).loadHandleable;
let assertComponent = (function(component) {
  if (!component.isQuiverComponent) {
    throw new Error('object must be of type Component');
  }
});
var Component = function Component() {
  var $__4;
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  let $__3 = options,
      name = $__3.name,
      subComponents = ($__4 = $__3.subComponents) === void 0 ? {} : $__4;
  this._name = name;
  this._id = Symbol();
  this._options = options;
  for (let key in subComponents) {
    let component = subComponents[key];
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
  clone: function() {
    let newInstance = Object.create(this);
    let privateId = Symbol();
    Object.defineProperty(newInstance, 'id', {get: function() {
        return privateId;
      }});
    return newInstance;
  },
  map: function(mapper) {
    var mapTable = arguments[1] !== (void 0) ? arguments[1] : {};
    let currentId = this.id;
    if (mapTable[currentId]) {
      return mapTable[currentId];
    }
    let copy = this.clone();
    mapTable[currentId] = copy;
    this.doMap(copy, mapper, mapTable);
    return copy;
  },
  each: function(iteratee) {
    let subComponents = (this).subComponents;
    for (let key in subComponents) {
      iteratee(subComponents[key]);
    }
  },
  doMap: function(target, mapper, mapTable) {
    let subComponents = (this).subComponents;
    let newSubComponents = {};
    for (let key in subComponents) {
      let component = subComponents[key];
      newSubComponents[key] = mapper(component, mapTable);
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
    return this.map((function(component, mapTable) {
      return component.fork(mapTable);
    }), forkTable);
  },
  implement: function(componentMap) {
    this.each((function(component) {
      return component.implement(componentMap);
    }));
    return this;
  },
  toJson: function() {
    let json = {
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
