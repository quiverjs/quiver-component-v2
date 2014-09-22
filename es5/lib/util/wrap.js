"use strict";
Object.defineProperties(exports, {
  safeHandler: {get: function() {
      return safeHandler;
    }},
  safeBuilder: {get: function() {
      return safeBuilder;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__;
var $__0 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    safePromised = $__0.safePromised,
    createPromise = $__0.createPromise;
var assertFunction = (function(fn) {
  if (typeof(fn) != 'function') {
    throw new Error('argument must be of type function');
  }
});
var safeHandler = (function(handler) {
  var $__3;
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  var $__2 = options,
      safeWrapped = ($__3 = $__2.safeWrapped) === void 0 ? false : $__3;
  if (safeWrapped)
    return handler;
  assertFunction(handler);
  options.safeWrapped = true;
  return safePromised(handler);
});
var safeBuilder = (function(builder) {
  var $__3;
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  var $__2 = options,
      safeWrapped = ($__3 = $__2.safeWrapped) === void 0 ? false : $__3;
  if (safeWrapped)
    return builder;
  assertFunction(builder);
  options.safeWrapped = true;
  var safeBuilder = safePromised(builder);
  return (function() {
    for (var args = [],
        $__1 = 0; $__1 < arguments.length; $__1++)
      args[$__1] = arguments[$__1];
    return safeBuilder.apply(null, $traceurRuntime.spread(args)).then(safeHandler);
  });
});
