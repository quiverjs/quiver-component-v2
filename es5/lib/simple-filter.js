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
    $__filter_46_js__,
    $__util_47_wrap_46_js__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var $__2 = ($__filter_46_js__ = require("./filter.js"), $__filter_46_js__ && $__filter_46_js__.__esModule && $__filter_46_js__ || {default: $__filter_46_js__}),
    StreamFilter = $__2.StreamFilter,
    HttpFilter = $__2.HttpFilter,
    HandleableFilter = $__2.HandleableFilter;
var $__3 = ($__util_47_wrap_46_js__ = require("./util/wrap.js"), $__util_47_wrap_46_js__ && $__util_47_wrap_46_js__.__esModule && $__util_47_wrap_46_js__ || {default: $__util_47_wrap_46_js__}),
    safeBuilder = $__3.safeBuilder,
    safeHandler = $__3.safeHandler;
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
          $__5 = 0; $__5 < arguments.length; $__5++)
        args[$__5] = arguments[$__5];
      return handler.apply(null, $traceurRuntime.spread(args)).catch(errorHandler);
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
    return argsHandler(args).then((function(args) {
      return handler(args, inputStreamable);
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
  $traceurRuntime.superCall(this, $ArgsBuilderFilter.prototype, "constructor", [null, options]);
};
var $ArgsBuilderFilter = ArgsBuilderFilter;
($traceurRuntime.createClass)(ArgsBuilderFilter, {
  get handleableFilter() {
    return argsBuilderToFilter(this.argsBuilder);
  },
  get argsBuilder() {
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
  $traceurRuntime.superCall(this, $ArgsFilter.prototype, "constructor", [null, options]);
};
var $ArgsFilter = ArgsFilter;
($traceurRuntime.createClass)(ArgsFilter, {
  get argsBuilder() {
    var argsHandler = this.argsHandler;
    return (function(config) {
      return resolve(argsHandler);
    });
  },
  get argsHandler() {
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
  $traceurRuntime.superCall(this, $ErrorFilter.prototype, "constructor", [null, options]);
};
var $ErrorFilter = ErrorFilter;
($traceurRuntime.createClass)(ErrorFilter, {
  get streamFilter() {
    return errorToFilter(this.errorHandler);
  },
  get errorHandler() {
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
  $traceurRuntime.superCall(this, $ErrorBuilderFilter.prototype, "constructor", [null, options]);
};
var $ErrorBuilderFilter = ErrorBuilderFilter;
($traceurRuntime.createClass)(ErrorBuilderFilter, {
  get streamFilter() {
    return builderFilterConvert(this.errorBuilder, errorToFilter);
  },
  get errorBuilder() {
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
