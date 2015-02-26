"use strict";
Object.defineProperties(module.exports, {
  ListComponent: {get: function() {
      return ListComponent;
    }},
  listComponent: {get: function() {
      return listComponent;
    }},
  __esModule: {value: true}
});
var $___46__46__47_component__;
var Component = ($___46__46__47_component__ = require("../component"), $___46__46__47_component__ && $___46__46__47_component__.__esModule && $___46__46__47_component__ || {default: $___46__46__47_component__}).Component;
let _componentArray = Symbol('@componentArray');
var ListComponent = function ListComponent() {
  var componentList = arguments[0] !== (void 0) ? arguments[0] : [];
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this[_componentArray] = componentList;
  $traceurRuntime.superConstructor($ListComponent).call(this, options);
};
var $ListComponent = ListComponent;
($traceurRuntime.createClass)(ListComponent, {
  each: function(iteratee) {
    this[_componentArray].forEach(iteratee);
    $traceurRuntime.superGet(this, $ListComponent.prototype, "each").call(this, iteratee);
  },
  doMap: function(target, mapper, mapTable) {
    target[_componentArray] = this[_componentArray].map((function(component) {
      return component.applyMap(mapper, mapTable);
    }));
    $traceurRuntime.superGet(this, $ListComponent.prototype, "doMap").call(this, target, mapper, mapTable);
  },
  push: function(component) {
    if (!component.isQuiverComponent) {
      throw new TypeError('object must be a quiver component');
    }
    this[_componentArray].push(component);
  },
  unshift: function(component) {
    if (!component.isQuiverComponent) {
      throw new TypeError('object must be a quiver component');
    }
    this[_componentArray].unshift(component);
  },
  get array() {
    return this[_componentArray];
  }
}, {}, Component);
let listComponent = (function() {
  var components = arguments[0] !== (void 0) ? arguments[0] : [];
  return new ListComponent(components);
});
