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
var $__quiver_45_object__,
    $__quiver_45_promise__,
    $__filter__,
    $__util_47_wrap__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var $__2 = ($__filter__ = require("./filter"), $__filter__ && $__filter__.__esModule && $__filter__ || {default: $__filter__}),
    StreamFilter = $__2.StreamFilter,
    HttpFilter = $__2.HttpFilter,
    HandleableFilter = $__2.HandleableFilter;
var $__3 = ($__util_47_wrap__ = require("./util/wrap"), $__util_47_wrap__ && $__util_47_wrap__.__esModule && $__util_47_wrap__ || {default: $__util_47_wrap__}),
    safeBuilder = $__3.safeBuilder,
    safeHandler = $__3.safeHandler;
var argsToStreamFilter = (function(argsHandler) {
  return (function(config, handler) {
    return resolve((function(args, inputStreamable) {
      return argsHandler(args).then(newArgs = (function(args) {
        return handler(newArgs, inputStreamable);
      }));
    }));
  });
});
var errorToFilter = (function(errorHandler) {
  return (function(config, handler) {
    return resolve((function() {
      for (var args = [],
          $__5 = 0; $__5 < arguments.length; $__5++)
        args[$__5] = arguments[$__5];
      return handler.apply(null, $traceurRuntime.spread(args)).catch((function(err) {
        return errorHandler(err).then((function(result) {
          if (!result)
            throw err;
          return result;
        }));
      }));
    }));
  });
});
var builderFilterConvert = (function(builder, filterConvert) {
  return (function(config, handler) {
    return builder(config).then((function(customHandler) {
      return filterConvert(customHandler)(config, handler);
    }));
  });
});
var applyArgsFilter = (function(argsHandler, handler) {
  return (function(args, inputStreamable) {
    return argsHandler(args).then((function() {
      var newArgs = arguments[0] !== (void 0) ? arguments[0] : args;
      return handler(newArgs, inputStreamable);
    }));
  });
});
var argsBuilderToFilter = (function(argsBuilder) {
  return (function(config, handleable) {
    var $__6 = handleable,
        streamHandler = $__6.streamHandler,
        metaHandlers = $__6.meta;
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
  this._argsBuilder = safeBuilder(argsBuilder, options);
  if (options.copyConfig === undefined)
    options.copyConfig = true;
  $traceurRuntime.superConstructor($ArgsBuilderFilter).call(this, null, options);
};
var $ArgsBuilderFilter = ArgsBuilderFilter;
($traceurRuntime.createClass)(ArgsBuilderFilter, {
  toHandleableFilter: function() {
    return argsBuilderToFilter(this.toArgsBuilder());
  },
  toArgsBuilder: function() {
    if (!this._argsBuilder)
      throw new Error('argsBuilder is not defined');
    return this._argsBuilder;
  },
  get type() {
    return 'args builder filter';
  }
}, {}, HandleableFilter);
var ArgsFilter = function ArgsFilter(argsHandler) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._argsHandler = safeHandler(argsHandler, options);
  options.copyConfig = false;
  $traceurRuntime.superConstructor($ArgsFilter).call(this, null, options);
};
var $ArgsFilter = ArgsFilter;
($traceurRuntime.createClass)(ArgsFilter, {
  toArgsBuilder: function() {
    var argsHandler = this.toArgsHandler();
    return (function(config) {
      return resolve(argsHandler);
    });
  },
  toArgsHandler: function() {
    if (!this._argsHandler)
      throw new Error('argsHandler is not defined');
    return this._argsHandler;
  },
  get type() {
    return 'args filter';
  }
}, {}, ArgsBuilderFilter);
var ErrorFilter = function ErrorFilter(errorHandler) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._errorHandler = safeHandler(errorHandler, options);
  $traceurRuntime.superConstructor($ErrorFilter).call(this, null, options);
};
var $ErrorFilter = ErrorFilter;
($traceurRuntime.createClass)(ErrorFilter, {
  toStreamFilter: function() {
    return errorToFilter(this.toErrorHandler());
  },
  toErrorHandler: function() {
    if (!this._errorHandler)
      throw new Error('errorHandler is not defined');
    return this._errorHandler;
  },
  get type() {
    return 'error filter';
  }
}, {}, StreamFilter);
var ErrorBuilderFilter = function ErrorBuilderFilter(errorBuilder) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._errorBuilder = safeBuilder(errorBuilder, options);
  $traceurRuntime.superConstructor($ErrorBuilderFilter).call(this, null, options);
};
var $ErrorBuilderFilter = ErrorBuilderFilter;
($traceurRuntime.createClass)(ErrorBuilderFilter, {
  toStreamFilter: function() {
    return builderFilterConvert(this.toErrorBuilder(), errorToFilter);
  },
  toErrorBuilder: function() {
    if (!this._errorBuilder)
      throw new Error('errorBuilder is not defined');
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
