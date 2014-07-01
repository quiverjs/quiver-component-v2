"use strict";
Object.defineProperties(exports, {
  ArgsFilter: {get: function() {
      return ArgsFilter;
    }},
  ArgsBuilderFilter: {get: function() {
      return ArgsBuilderFilter;
    }},
  ErrorFilter: {get: function() {
      return ErrorFilter;
    }},
  ErrorBuilderFilter: {get: function() {
      return ErrorBuilderFilter;
    }},
  ErrorHttpFilter: {get: function() {
      return ErrorHttpFilter;
    }},
  ErrorBuilderHttpFilter: {get: function() {
      return ErrorBuilderHttpFilter;
    }},
  __esModule: {value: true}
});
var StreamFilter = $traceurRuntime.assertObject(require('./filter.js')).StreamFilter;
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var safePromised = $traceurRuntime.assertObject(require('quiver-promise')).safePromised;
var argsToStreamFilter = (function(argsHandler) {
  return (function(config, handler) {
    return (function(args, inputStreamable) {
      return resolve(argsHandler(args)).then((function(newArgs) {
        return handler(args, inputStreamable);
      }));
    });
  });
});
var errorToFilter = (function(errorHandler) {
  return (function(config, handler) {
    return (function() {
      for (var args = [],
          $__1 = 0; $__1 < arguments.length; $__1++)
        args[$__1] = arguments[$__1];
      return handler.apply(null, $traceurRuntime.toObject(args)).catch(errorHandler);
    });
  });
});
var builderFilterConvert = (function(builder, filterConvert) {
  return (function(config, handler) {
    return builder(copy(config)).then((function(customHandler) {
      return filterConvert(customHandler)(config, handler);
    }));
  });
});
var argsHandlerKeys = ['streamHandler', 'cacheIdHandler'];
var ArgsFilter = function ArgsFilter(argsHandler, options) {
  this._argsHandler = argsHandler;
  if (!options.applyToHandlers) {
    options.applyToHandlers = argsHandlerKeys;
  }
  var streamFilter = argsToStreamFilter(argsHandler);
  $traceurRuntime.superCall(this, $ArgsFilter.prototype, "constructor", [streamFilter, options]);
};
var $ArgsFilter = ArgsFilter;
($traceurRuntime.createClass)(ArgsFilter, {}, {}, StreamFilter);
var ArgsBuilderFilter = function ArgsBuilderFilter(argsBuilder, options) {
  this._argsBuilder = argsBuilder;
  if (!options.applyToHandlers) {
    options.applyToHandlers = argsHandlerKeys;
  }
  var streamFilter = builderFilterConvert(argsBuilder, argsToStreamFilter);
  $traceurRuntime.superCall(this, $ArgsBuilderFilter.prototype, "constructor", [streamFilter, options]);
};
var $ArgsBuilderFilter = ArgsBuilderFilter;
($traceurRuntime.createClass)(ArgsBuilderFilter, {}, {}, StreamFilter);
var createErrorFilterClass = (function(ParentClass) {
  return (function($__super) {
    var ErrorFilter = function ErrorFilter(errorHandler, options) {
      this._errorHandler = errorHandler;
      var streamFilter = errorToFilter(errorHandler);
      $traceurRuntime.superCall(this, ErrorFilter.prototype, "constructor", [streamFilter, options]);
    };
    return ($traceurRuntime.createClass)(ErrorFilter, {}, {}, $__super);
  }(ParentClass));
});
var createErrorBuilderFilterClass = (function(ParentClass) {
  return (function($__super) {
    var ErrorBuilderFilter = function ErrorBuilderFilter(errorBuilder, options) {
      this._errorBuilder = errorBuilder;
      var streamFilter = builderFilterConvert(errorBuilder, errorToFilter);
      $traceurRuntime.superCall(this, ErrorBuilderFilter.prototype, "constructor", [streamFilter, options]);
    };
    return ($traceurRuntime.createClass)(ErrorBuilderFilter, {}, {}, $__super);
  }(ParentClass));
});
var ErrorFilter = createErrorFilterClass(StreamFilter);
var ErrorBuilderFilter = createErrorBuilderFilterClass(StreamFilter);
var ErrorHttpFilter = createErrorFilterClass(HttpFilter);
var ErrorBuilderHttpFilter = createErrorBuilderFilterClass(HttpFilter);
