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
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var $__1 = $traceurRuntime.assertObject(require('./util/wrap.js')),
    safeHandler = $__1.safeHandler,
    safeBuilder = $__1.safeBuilder;
var HandleableMiddleware = $traceurRuntime.assertObject(require('./handleable-middleware.js')).HandleableMiddleware;
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
var filterToMiddleware = (function(filter) {
  return (function(config, builder) {
    return builder(config).then((function(handler) {
      return filter(config, handler);
    }));
  });
});
var HandleableFilter = function HandleableFilter(handleableFilter) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._handleableFilter = handleableFilter;
  this._handleableFilter = safeHandler(handleableFilter, options);
  $traceurRuntime.superCall(this, $HandleableFilter.prototype, "constructor", [null, options]);
};
var $HandleableFilter = HandleableFilter;
($traceurRuntime.createClass)(HandleableFilter, {
  get mainMiddleware() {
    return filterToMiddleware(this.handleableFilter);
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
    return streamToHandleableFilter(this.streamFilter);
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
    return httpToHandleableFilter(this.httpFilter);
  },
  get httpFilter() {
    var httpFilter = this._httpFilter;
    if (!httpFilter)
      throw new Error('streamFilter is not defined');
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
