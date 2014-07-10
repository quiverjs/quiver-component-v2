"use strict";
Object.defineProperties(exports, {
  privatizedConstructor: {get: function() {
      return privatizedConstructor;
    }},
  __esModule: {value: true}
});
var privatizedConstructor = (function(Component) {
  return (function() {
    for (var args = [],
        $__0 = 0; $__0 < arguments.length; $__0++)
      args[$__0] = arguments[$__0];
    var component = new (Function.prototype.bind.apply(Component, $traceurRuntime.spread([null], args)))();
    return (function() {
      var bundle = arguments[0] !== (void 0) ? arguments[0] : {};
      return component.makePrivate(bundle);
    });
  });
});
