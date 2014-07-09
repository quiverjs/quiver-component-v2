"use strict";
Object.defineProperties(exports, {
  ArgsBuilderFilter: {get: function() {
      return ArgsBuilderFilter;
    }},
  ArgsFilter: {get: function() {
      return ArgsFilter;
    }},
  ErrorFilter: {get: function() {
      return ErrorFilter;
    }},
  ErrorBuilderFilter: {get: function() {
      return ErrorBuilderFilter;
    }},
  argsFilter: {get: function() {
      return argsFilter;
    }},
  argsBuilderFilter: {get: function() {
      return argsBuilderFilter;
    }},
  errorFilter: {get: function() {
      return errorFilter;
    }},
  errorBuilderFilter: {get: function() {
      return errorBuilderFilter;
    }},
  __esModule: {value: true}
});
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var $__2 = $traceurRuntime.assertObject(require('./filter.js')),
    StreamFilter = $__2.StreamFilter,
    HttpFilter = $__2.HttpFilter,
    HandleableFilter = $__2.HandleableFilter;
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
var applyArgsFilter = (function(argsHandler, handler) {
  return (function(args, inputStreamable) {
    return argsHandler(args).then((function(args) {
      return handler(args, inputStreamable);
    }));
  });
});
var argsBuilderToFilter = (function(argsBuilder) {
  return (function(config, handleable) {
    var $__2 = $traceurRuntime.assertObject(handleable),
        streamHandler = $__2.streamHandler,
        metaHandlers = $__2.meta;
    if (!streamHandler && !metaHandlers)
      return resolve(handleable);
    return argsBuilder(config).then((function(argsHandler) {
      if (streamHandler) {
        handleable.streamHandler = applyArgsFilter(argsHandler, streamHandler);
      }
      if (metaHandlers) {
        for (var key in metaHandlers) {
          metaHandlers[key] = applyArgsFilter(argsHandler, metaHandlers[key]);
        }
      }
      return handleable;
    }));
  });
});
var ArgsBuilderFilter = function ArgsBuilderFilter(argsBuilder) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._argsBuilder = argsBuilder;
  argsBuilder = safeBuilder(argsBuilder, options);
  var filter = argsBuilderToFilter(argsBuilder);
  $traceurRuntime.superCall(this, $ArgsBuilderFilter.prototype, "constructor", [filter, options]);
};
var $ArgsBuilderFilter = ArgsBuilderFilter;
($traceurRuntime.createClass)(ArgsBuilderFilter, {
  get argsBuilder() {
    return this._argsBuilder;
  },
  get type() {
    return 'args builder filter';
  }
}, {}, HandleableFilter);
var ArgsFilter = function ArgsFilter(argsHandler) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._argsHandler = argsHandler;
  argsHandler = safeHandler(argsHandler, options);
  var argsBuilder = (function(config) {
    return resolve(argsHandler);
  });
  $traceurRuntime.superCall(this, $ArgsFilter.prototype, "constructor", [argsBuilder, options]);
};
var $ArgsFilter = ArgsFilter;
($traceurRuntime.createClass)(ArgsFilter, {
  get argsFilter() {
    return this._argsFilter;
  },
  get type() {
    return 'args filter';
  }
}, {}, ArgsBuilderFilter);
var ErrorFilter = function ErrorFilter(errorHandler) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._errorFilter = errorHandler;
  errorHandler = safeHandler(errorHandler, options);
  var streamFilter = errorToFilter(errorHandler);
  $traceurRuntime.superCall(this, $ErrorFilter.prototype, "constructor", [streamFilter, options]);
};
var $ErrorFilter = ErrorFilter;
($traceurRuntime.createClass)(ErrorFilter, {
  get errorFilter() {
    return this._errorFilter;
  },
  get type() {
    return 'error filter';
  }
}, {}, StreamFilter);
var ErrorBuilderFilter = function ErrorBuilderFilter(errorBuilder) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._errorBuilder = errorBuilder;
  errorBuilder = safeBuilder(errorBuilder, options);
  var streamFilter = builderFilterConvert(errorBuilder, errorToFilter);
  $traceurRuntime.superCall(this, $ErrorBuilderFilter.prototype, "constructor", [streamFilter, options]);
};
var $ErrorBuilderFilter = ErrorBuilderFilter;
($traceurRuntime.createClass)(ErrorBuilderFilter, {
  get errorBuilder() {
    return this._errorBuilder;
  },
  get type() {
    return 'error builder filter';
  }
}, {}, StreamFilter);
var argsFilter = (function(handler, options) {
  return new ArgsFilter(handler, options);
});
var argsBuilderFilter = (function(builder, options) {
  return new ArgsBuilderFilter(builder, options);
});
var errorFilter = (function(handler, options) {
  return new ErrorFilter(handler, options);
});
var errorBuilderFilter = (function(builder, options) {
  return new ErrorBuilderFilter(builder, options);
});
