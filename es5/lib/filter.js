"use strict";
Object.defineProperties(exports, {
  filterToHandleableFilter: {get: function() {
      return filterToHandleableFilter;
    }},
  streamToHandleableFilter: {get: function() {
      return streamToHandleableFilter;
    }},
  httpToHandleableFilter: {get: function() {
      return httpToHandleableFilter;
    }},
  filterToMiddleware: {get: function() {
      return filterToMiddleware;
    }},
  HandleableFilter: {get: function() {
      return HandleableFilter;
    }},
  StreamFilter: {get: function() {
      return StreamFilter;
    }},
  HttpFilter: {get: function() {
      return HttpFilter;
    }},
  handleableFilter: {get: function() {
      return handleableFilter;
    }},
  streamFilter: {get: function() {
      return streamFilter;
    }},
  httpFilter: {get: function() {
      return httpFilter;
    }},
  __esModule: {value: true}
});
var $__quiver_45_object__,
    $__quiver_45_promise__,
    $__quiver_45_http__,
    $__util_47_wrap__,
    $__handleable_45_middleware__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var streamToHttpHandler = ($__quiver_45_http__ = require("quiver-http"), $__quiver_45_http__ && $__quiver_45_http__.__esModule && $__quiver_45_http__ || {default: $__quiver_45_http__}).streamToHttpHandler;
var $__3 = ($__util_47_wrap__ = require("./util/wrap"), $__util_47_wrap__ && $__util_47_wrap__.__esModule && $__util_47_wrap__ || {default: $__util_47_wrap__}),
    safeHandler = $__3.safeHandler,
    safeBuilder = $__3.safeBuilder;
var HandleableMiddleware = ($__handleable_45_middleware__ = require("./handleable-middleware"), $__handleable_45_middleware__ && $__handleable_45_middleware__.__esModule && $__handleable_45_middleware__ || {default: $__handleable_45_middleware__}).HandleableMiddleware;
var noCopy = (function(config) {
  return config;
});
var filterToHandleableFilter = (function(filter, handlerKey) {
  return (function(config, handleable) {
    var handler = handleable[handlerKey];
    if (!handler)
      return resolve(handleable);
    return filter(config, handler).then((function(filteredHandler) {
      handleable[handlerKey] = filteredHandler;
      return handleable;
    }));
  });
});
var streamToHandleableFilter = (function(filter) {
  return filterToHandleableFilter(filter, 'streamHandler');
});
var httpToHandleableFilter = (function(filter) {
  return filterToHandleableFilter(filter, 'httpHandler');
});
var filterToMiddleware = (function(filter, copyConfig) {
  return (function(config, builder) {
    return builder(copyConfig(config)).then((function(handler) {
      return filter(config, handler);
    }));
  });
});
var HandleableFilter = function HandleableFilter(handleableFilter) {
  var $__7;
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  var $__6 = options,
      copyConfig = ($__7 = $__6.copyConfig) === void 0 ? true : $__7;
  this._copyConfig = copyConfig;
  this._handleableFilter = handleableFilter;
  this._handleableFilter = safeHandler(handleableFilter, options);
  $traceurRuntime.superCall(this, $HandleableFilter.prototype, "constructor", [null, options]);
};
var $HandleableFilter = HandleableFilter;
($traceurRuntime.createClass)(HandleableFilter, {
  get mainMiddleware() {
    var copyConfig = this._copyConfig ? copy : noCopy;
    return filterToMiddleware(this.handleableFilter, copyConfig);
  },
  get handleableFilter() {
    if (!this._handleableFilter)
      throw new Error('handleableFilter is not defined');
    return this._handleableFilter;
  }
}, {}, HandleableMiddleware);
var StreamFilter = function StreamFilter(filter) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._streamFilter = safeBuilder(filter, options);
  $traceurRuntime.superCall(this, $StreamFilter.prototype, "constructor", [null, options]);
};
var $StreamFilter = StreamFilter;
($traceurRuntime.createClass)(StreamFilter, {
  get handleableFilter() {
    var streamFilter = this.streamFilter;
    return (function(config, handleable) {
      var handler = handleable.streamHandler;
      if (!handler)
        return resolve(handleable);
      return streamFilter(config, handler).then((function(filteredHandler) {
        handleable.streamHandler = filteredHandler;
        return handleable;
      }));
    });
  },
  get streamFilter() {
    var streamFilter = this._streamFilter;
    if (!streamFilter)
      throw new Error('streamFilter is not defined');
    return streamFilter;
  },
  get type() {
    return 'Stream Filter';
  }
}, {}, HandleableFilter);
var HttpFilter = function HttpFilter(filter) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._httpFilter = safeBuilder(filter, options);
  $traceurRuntime.superCall(this, $HttpFilter.prototype, "constructor", [null, options]);
};
var $HttpFilter = HttpFilter;
($traceurRuntime.createClass)(HttpFilter, {
  get handleableFilter() {
    var httpFilter = this.httpFilter;
    return (function(config, handleable) {
      var httpHandler = handleable.httpHandler;
      if (!httpHandler) {
        var streamHandler = handleable.streamHandler;
        if (!streamHandler)
          return resolve(handleable);
        httpHandler = streamToHttpHandler(streamHandler);
        handleable = {httpHandler: httpHandler};
      }
      return httpFilter(config, httpHandler).then((function(filteredHandler) {
        handleable.httpHandler = filteredHandler;
        return handleable;
      }));
    });
  },
  get httpFilter() {
    var httpFilter = this._httpFilter;
    if (!httpFilter)
      throw new Error('httpFilter is not defined');
    return httpFilter;
  },
  get type() {
    return 'Stream Filter';
  }
}, {}, HandleableFilter);
var handleableFilter = (function(filter, options) {
  return new HandleableFilter(filter, options);
});
var streamFilter = (function(filter, options) {
  return new StreamFilter(filter, options);
});
var httpFilter = (function(filter, options) {
  return new HttpFilter(filter, options);
});
