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
var $__1 = $traceurRuntime.assertObject(require('quiver-promise')),
    safePromised = $__1.safePromised,
    createPromise = $__1.createPromise;
var assertFunction = (function(fn) {
  if (typeof(fn) != 'function') {
    throw new Error('argument must be of type function');
  }
});
var safeHandler = (function(handler) {
  var $__2;
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  var $__1 = $traceurRuntime.assertObject(options),
      safeWrapped = ($__2 = $__1.safeWrapped) === void 0 ? false : $__2;
  if (safeWrapped)
    return handler;
  assertFunction(handler);
  options.safeWrapped = true;
  return safePromised(handler);
});
var safeBuilder = (function(builder) {
  var $__2;
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  var $__1 = $traceurRuntime.assertObject(options),
      safeWrapped = ($__2 = $__1.safeWrapped) === void 0 ? false : $__2;
  if (safeWrapped)
    return builder;
  assertFunction(builder);
  options.safeWrapped = true;
  var safeBuilder = safePromised(builder);
  return (function() {
    for (var args = [],
        $__0 = 0; $__0 < arguments.length; $__0++)
      args[$__0] = arguments[$__0];
    return safeBuilder.apply(null, $traceurRuntime.toObject(args)).then(safeHandler);
  });
});
