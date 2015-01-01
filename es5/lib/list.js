"use strict";
Object.defineProperties(exports, {
  ComponentList: {get: function() {
      return ComponentList;
    }},
  componentList: {get: function() {
      return componentList;
    }},
  __esModule: {value: true}
});
var $__component__;
var Component = ($__component__ = require("./component"), $__component__ && $__component__.__esModule && $__component__ || {default: $__component__}).Component;
var ComponentList = function ComponentList(componentList, options) {
  this._componentArray = componentList;
  $traceurRuntime.superConstructor($ComponentList).call(this, options);
};
var $ComponentList = ComponentList;
($traceurRuntime.createClass)(ComponentList, {
  each: function(iteratee) {
    this._componentArray.forEach(iteratee);
    $traceurRuntime.superGet(this, $ComponentList.prototype, "each").call(this, iteratee);
  },
  doMap: function(target, mapper, mapTable) {
    target._componentArray = this._componentArray.map((function(component) {
      return mapper(component, mapTable);
    }));
    $traceurRuntime.superGet(this, $ComponentList.prototype, "doMap").call(this, mapper, mapTable);
  },
  push: function(component) {
    if (!component.isQuiverComponent) {
      throw new TypeError('object must be a quiver component');
    }
    this._componentArray.push(component);
  },
  get array() {
    return this._componentArray;
  }
}, {}, Component);
var componentList = (function() {
  var components = arguments[0] !== (void 0) ? arguments[0] : [];
  return new ComponentList(components);
});
