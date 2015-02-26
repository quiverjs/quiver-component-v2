"use strict";
Object.defineProperties(module.exports, {
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
    $__stream_45_handler__,
    $__filter__,
    $__util_47_wrap__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var StreamHandlerBuilder = ($__stream_45_handler__ = require("./stream-handler"), $__stream_45_handler__ && $__stream_45_handler__.__esModule && $__stream_45_handler__ || {default: $__stream_45_handler__}).StreamHandlerBuilder;
var $__3 = ($__filter__ = require("./filter"), $__filter__ && $__filter__.__esModule && $__filter__ || {default: $__filter__}),
    StreamFilter = $__3.StreamFilter,
    HttpFilter = $__3.HttpFilter;
var $__4 = ($__util_47_wrap__ = require("./util/wrap"), $__util_47_wrap__ && $__util_47_wrap__.__esModule && $__util_47_wrap__ || {default: $__util_47_wrap__}),
    safeBuilder = $__4.safeBuilder,
    safeHandler = $__4.safeHandler;
let argsToStreamFilter = (function(argsHandler) {
  return (function(config, handler) {
    return resolve((function(args, inputStreamable) {
      return argsHandler(args).then(newArgs = (function(args) {
        return handler(newArgs, inputStreamable);
      }));
    }));
  });
});
let errorToFilter = (function(errorHandler) {
  return (function(config, handler) {
    return resolve((function() {
      for (var args = [],
          $__6 = 0; $__6 < arguments.length; $__6++)
        args[$__6] = arguments[$__6];
      return handler.apply((void 0), $traceurRuntime.spread(args)).catch((function(err) {
        return errorHandler(err).then((function(result) {
          if (!result)
            throw err;
          return result;
        }));
      }));
    }));
  });
});
let builderFilterConvert = (function(builder, filterConvert) {
  return (function(config, handler) {
    return builder(config).then((function(customHandler) {
      return filterConvert(customHandler)(config, handler);
    }));
  });
});
let applyArgsFilter = (function(argsHandler, handler) {
  return (function(args, inputStreamable) {
    return argsHandler(args).then((function() {
      var newArgs = arguments[0] !== (void 0) ? arguments[0] : args;
      return handler(newArgs, inputStreamable);
    }));
  });
});
let argsBuilderToFilter = (function(argsBuilder) {
  return (function(config, handler) {
    return argsBuilder(config).then((function(argsHandler) {
      return applyArgsFilter(argsHandler, handler);
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
  toStreamFilter: function() {
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
}, {}, StreamFilter);
var ArgsFilter = function ArgsFilter(argsHandler) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._argsHandler = safeHandler(argsHandler, options);
  options.copyConfig = false;
  $traceurRuntime.superConstructor($ArgsFilter).call(this, null, options);
};
var $ArgsFilter = ArgsFilter;
($traceurRuntime.createClass)(ArgsFilter, {
  toArgsBuilder: function() {
    let argsHandler = this.toArgsHandler();
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
let ArgsFilterMixin = {argsFilter: function(argsHandler) {
    return this.middleware(new ArgsFilter(argsHandler));
  }};
let mixinArgsFilter = (function(prototype) {
  return Object.assign(prototype, ArgsFilterMixin);
});
mixinArgsFilter(StreamHandlerBuilder.prototype);
let argsFilter = (function(handler, options) {
  return new ArgsFilter(handler, options);
});
let argsBuilderFilter = (function(builder, options) {
  return new ArgsBuilderFilter(builder, options);
});
let errorFilter = (function(handler, options) {
  return new ErrorFilter(handler, options);
});
let errorBuilderFilter = (function(builder, options) {
  return new ErrorBuilderFilter(builder, options);
});
