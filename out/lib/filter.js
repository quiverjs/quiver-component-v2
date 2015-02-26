"use strict";
Object.defineProperties(module.exports, {
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
let noCopy = (function(config) {
  return config;
});
let filterToHandleableFilter = (function(filter, handlerKey) {
  return (function(config, handleable) {
    let handler = handleable[handlerKey];
    if (!handler)
      return resolve(handleable);
    return filter(config, handler).then((function(filteredHandler) {
      handleable[handlerKey] = filteredHandler;
      return handleable;
    }));
  });
});
let streamToHandleableFilter = (function(filter) {
  return filterToHandleableFilter(filter, 'streamHandler');
});
let httpToHandleableFilter = (function(filter) {
  return filterToHandleableFilter(filter, 'httpHandler');
});
let filterToMiddleware = (function(filter, copyConfig) {
  return (function(config, builder) {
    return builder(copyConfig(config)).then((function(handler) {
      return filter(config, handler);
    }));
  });
});
var HandleableFilter = function HandleableFilter(handleableFilter) {
  var $__7;
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  let $__6 = options,
      copyConfig = ($__7 = $__6.copyConfig) === void 0 ? true : $__7;
  this._copyConfig = copyConfig;
  this._handleableFilter = handleableFilter;
  this._handleableFilter = safeHandler(handleableFilter, options);
  $traceurRuntime.superConstructor($HandleableFilter).call(this, null, options);
};
var $HandleableFilter = HandleableFilter;
($traceurRuntime.createClass)(HandleableFilter, {
  toMainHandleableMiddleware: function() {
    let copyConfig = this._copyConfig ? copy : noCopy;
    let handleableFilter = this.toHandleableFilter();
    return filterToMiddleware(handleableFilter, copyConfig);
  },
  toHandleableFilter: function() {
    if (!this._handleableFilter)
      throw new Error('handleableFilter is not defined');
    return this._handleableFilter;
  }
}, {}, HandleableMiddleware);
var StreamFilter = function StreamFilter(filter) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._streamFilter = safeBuilder(filter, options);
  $traceurRuntime.superConstructor($StreamFilter).call(this, null, options);
};
var $StreamFilter = StreamFilter;
($traceurRuntime.createClass)(StreamFilter, {
  toHandleableFilter: function() {
    let streamFilter = this.toStreamFilter();
    return (function(config, handleable) {
      let handler = handleable.streamHandler;
      if (!handler)
        return resolve(handleable);
      return streamFilter(config, handler).then((function(filteredHandler) {
        handleable.streamHandler = filteredHandler;
        return handleable;
      }));
    });
  },
  toStreamFilter: function() {
    let streamFilter = this._streamFilter;
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
  $traceurRuntime.superConstructor($HttpFilter).call(this, null, options);
};
var $HttpFilter = HttpFilter;
($traceurRuntime.createClass)(HttpFilter, {
  toHandleableFilter: function() {
    let httpFilter = this.toHttpFilter();
    return (function(config, handleable) {
      let httpHandler = handleable.httpHandler;
      if (!httpHandler) {
        let streamHandler = handleable.streamHandler;
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
  toHttpFilter: function() {
    let httpFilter = this._httpFilter;
    if (!httpFilter)
      throw new Error('httpFilter is not defined');
    return httpFilter;
  },
  get type() {
    return 'Http Filter';
  }
}, {}, HandleableFilter);
let handleableFilter = (function(filter, options) {
  return new HandleableFilter(filter, options);
});
let streamFilter = (function(filter, options) {
  return new StreamFilter(filter, options);
});
let httpFilter = (function(filter, options) {
  return new HttpFilter(filter, options);
});
