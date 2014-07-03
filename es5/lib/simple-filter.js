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
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var $__2 = $traceurRuntime.assertObject(require('./filter.js')),
    StreamFilter = $__2.StreamFilter,
    HttpFilter = $__2.HttpFilter;
var $__2 = $traceurRuntime.assertObject(require('./util/wrap.js')),
    safeBuilder = $__2.safeBuilder,
    safeHandler = $__2.safeHandler;
var argsToStreamFilter = (function(argsHandler) {
  return (function(config, handler) {
    return resolve((function(args, inputStreamable) {
      return argsHandler(args).then((function(newArgs) {
        return handler(newArgs, inputStreamable);
      }));
    }));
  });
});
var errorToFilter = (function(errorHandler) {
  return (function(config, handler) {
    return resolve((function() {
      for (var args = [],
          $__1 = 0; $__1 < arguments.length; $__1++)
        args[$__1] = arguments[$__1];
      return handler.apply(null, $traceurRuntime.toObject(args)).catch(errorHandler);
    }));
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
var ArgsFilter = function ArgsFilter(argsHandler) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._argsHandler = argsHandler;
  if (!options.applyToHandlers)
    options.applyToHandlers = argsHandlerKeys;
  this._argsFilter = argsHandler;
  argsHandler = safeHandler(argsHandler, options);
  var streamFilter = argsToStreamFilter(argsHandler);
  $traceurRuntime.superCall(this, $ArgsFilter.prototype, "constructor", [streamFilter, options]);
};
var $ArgsFilter = ArgsFilter;
($traceurRuntime.createClass)(ArgsFilter, {
  get argsFilter() {
    return this._argsFilter;
  },
  get type() {
    return 'args filter';
  }
}, {}, StreamFilter);
var ArgsBuilderFilter = function ArgsBuilderFilter(argsBuilder) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._argsBuilder = argsBuilder;
  if (!options.applyToHandlers)
    options.applyToHandlers = argsHandlerKeys;
  this._argsBuilder = argsBuilder;
  argsBuilder = safeBuilder(argsBuilder, options);
  var streamFilter = builderFilterConvert(argsBuilder, argsToStreamFilter);
  $traceurRuntime.superCall(this, $ArgsBuilderFilter.prototype, "constructor", [streamFilter, options]);
};
var $ArgsBuilderFilter = ArgsBuilderFilter;
($traceurRuntime.createClass)(ArgsBuilderFilter, {get type() {
    return 'args builder filter';
  }}, {}, StreamFilter);
var createErrorFilterClass = (function(ParentClass) {
  return (function($__super) {
    var ErrorFilter = function ErrorFilter(errorHandler) {
      var options = arguments[1] !== (void 0) ? arguments[1] : {};
      this._errorFilter = errorHandler;
      errorHandler = safeHandler(errorHandler, options);
      var streamFilter = errorToFilter(errorHandler);
      $traceurRuntime.superCall(this, ErrorFilter.prototype, "constructor", [streamFilter, options]);
    };
    return ($traceurRuntime.createClass)(ErrorFilter, {
      get errorFilter() {
        return this._errorFilter;
      },
      get type() {
        return 'error filter';
      }
    }, {}, $__super);
  }(ParentClass));
});
var createErrorBuilderFilterClass = (function(ParentClass) {
  return (function($__super) {
    var ErrorBuilderFilter = function ErrorBuilderFilter(errorBuilder) {
      var options = arguments[1] !== (void 0) ? arguments[1] : {};
      this._errorBuilder = errorBuilder;
      errorBuilder = safeBuilder(errorBuilder, options);
      var streamFilter = builderFilterConvert(errorBuilder, errorToFilter);
      $traceurRuntime.superCall(this, ErrorBuilderFilter.prototype, "constructor", [streamFilter, options]);
    };
    return ($traceurRuntime.createClass)(ErrorBuilderFilter, {
      get errorBuilder() {
        return this._errorBuilder;
      },
      get type() {
        return 'error builder filter';
      }
    }, {}, $__super);
  }(ParentClass));
});
var ErrorFilter = createErrorFilterClass(StreamFilter);
var ErrorBuilderFilter = createErrorBuilderFilterClass(StreamFilter);
var ErrorHttpFilter = createErrorFilterClass(HttpFilter);
var ErrorBuilderHttpFilter = createErrorBuilderFilterClass(HttpFilter);
