"use strict";
Object.defineProperties(exports, {
  Component: {get: function() {
      return Component;
    }},
  __esModule: {value: true}
});
let assertComponent = (function(component) {
  if (!component.isQuiverComponent) {
    throw new Error('object must be of type Component');
  }
});
let randomId = (function() {
  return Symbol((Math.random() * 0x1000000 | 0).toString(16));
});
var Component = function Component() {
  var $__3;
  var options = arguments[0] !== (void 0) ? arguments[0] : {};
  let $__2 = options,
      name = $__2.name,
      subComponents = ($__3 = $__2.subComponents) === void 0 ? {} : $__3;
  this._id = randomId();
  this._options = options;
  if (name) {
    this.name = name;
  }
  for (let key in subComponents) {
    let component = subComponents[key];
    assertComponent(component);
  }
  this._subComponents = subComponents;
};
($traceurRuntime.createClass)(Component, {
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
  addSubComponent: function(key, component) {
    if (!component.isQuiverComponent) {
      throw new Error('Subcomponent must be Quiver component');
    }
    let subComponents = (this).subComponents;
    if (subComponents[key]) {
      throw new Error('Subcomponent already registered at given key');
    }
    subComponents[key] = component;
  },
  getSubComponent: function(key) {
    return this.subComponents[key];
  },
  setName: function(name) {
    this.name = name;
    return this;
  },
  clone: function() {
    let newInstance = Object.create(this);
    let privateId = randomId();
    Object.defineProperty(newInstance, 'id', {get: function() {
        return privateId;
      }});
    return newInstance;
  },
  applyMap: function(mapper) {
    var mapTable = arguments[1] !== (void 0) ? arguments[1] : {};
    let currentId = this.id;
    if (mapTable[currentId]) {
      return mapTable[currentId];
    }
    return mapTable[currentId] = mapper(this, mapTable);
  },
  map: function(mapper) {
    var mapTable = arguments[1] !== (void 0) ? arguments[1] : {};
    let clone = this.clone();
    this.doMap(clone, mapper, mapTable);
    return clone;
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
      newSubComponents[key] = component.applyMap(mapper, mapTable);
    }
    target._subComponents = newSubComponents;
  },
  factory: function() {
    var $__0 = this;
    return (function() {
      var forkTable = arguments[0] !== (void 0) ? arguments[0] : {};
      return $__0.fork(forkTable);
    });
  },
  fork: function() {
    var forkTable = arguments[0] !== (void 0) ? arguments[0] : {};
    return this.applyMap((function(component, mapTable) {
      return component.map((function(subComponent, mapTable) {
        return subComponent.fork(mapTable);
      }), mapTable);
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
