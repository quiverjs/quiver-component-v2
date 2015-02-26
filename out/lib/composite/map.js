"use strict";
Object.defineProperties(module.exports, {
  MapComponent: {get: function() {
      return MapComponent;
    }},
  mapComponent: {get: function() {
      return mapComponent;
    }},
  __esModule: {value: true}
});
var $___46__46__47_component__;
var Component = ($___46__46__47_component__ = require("../component"), $___46__46__47_component__ && $___46__46__47_component__.__esModule && $___46__46__47_component__ || {default: $___46__46__47_component__}).Component;
let _componentMap = Symbol('@componentMap');
var MapComponent = function MapComponent() {
  var componentMap = arguments[0] !== (void 0) ? arguments[0] : new Map();
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this[_componentMap] = componentMap;
  $traceurRuntime.superConstructor($MapComponent).call(this, options);
};
var $MapComponent = MapComponent;
($traceurRuntime.createClass)(MapComponent, {
  each: function(iteratee) {
    var $__5 = true;
    var $__6 = false;
    var $__7 = undefined;
    try {
      for (var $__3,
          $__2 = (this[_componentMap].values())[$traceurRuntime.toProperty(Symbol.iterator)](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
        let component = $__3.value;
        {
          iteratee(component);
        }
      }
    } catch ($__8) {
      $__6 = true;
      $__7 = $__8;
    } finally {
      try {
        if (!$__5 && $__2.return != null) {
          $__2.return();
        }
      } finally {
        if ($__6) {
          throw $__7;
        }
      }
    }
    $traceurRuntime.superGet(this, $MapComponent.prototype, "each").call(this, iteratee);
  },
  doMap: function(target, mapper, mapTable) {
    var $__10,
        $__11;
    let targetMap = new Map();
    var $__5 = true;
    var $__6 = false;
    var $__7 = undefined;
    try {
      for (var $__3,
          $__2 = (this[_componentMap].entries())[$traceurRuntime.toProperty(Symbol.iterator)](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
        let $__9 = $__3.value,
            key = ($__10 = $__9[$traceurRuntime.toProperty(Symbol.iterator)](), ($__11 = $__10.next()).done ? void 0 : $__11.value),
            component = ($__11 = $__10.next()).done ? void 0 : $__11.value;
        {
          targetMap[key] = component.applyMap(mapper, mapTable);
        }
      }
    } catch ($__8) {
      $__6 = true;
      $__7 = $__8;
    } finally {
      try {
        if (!$__5 && $__2.return != null) {
          $__2.return();
        }
      } finally {
        if ($__6) {
          throw $__7;
        }
      }
    }
    allKeys(componentMap).forEach((function(key) {
      let component = componentMap[key];
      targetMap[key] = component.applyMap(mapper, mapTable);
    }));
    target[_componentMap] = targetMap;
    $traceurRuntime.superGet(this, $MapComponent.prototype, "doMap").call(this, target, mapper, mapTable);
  },
  set: function(key, component) {
    if (!component.isQuiverComponent) {
      throw new TypeError('object must be a quiver component');
    }
    this[_componentMap].set(key, component);
  },
  get: function(key) {
    return this[_componentMap].get(key);
  },
  get map() {
    return this[_componentMap];
  }
}, {}, Component);
let mapComponent = (function() {
  var components = arguments[0] !== (void 0) ? arguments[0] : new Map();
  return new MapComponent(components);
});
