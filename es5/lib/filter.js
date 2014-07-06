"use strict";
Object.defineProperties(exports, {
  HandleableFilter: {get: function() {
      return HandleableFilter;
    }},
  StreamFilter: {get: function() {
      return StreamFilter;
    }},
  HttpFilter: {get: function() {
      return HttpFilter;
    }},
  __esModule: {value: true}
});
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var $__1 = $traceurRuntime.assertObject(require('./util/wrap.js')),
    safeHandler = $__1.safeHandler,
    safeBuilder = $__1.safeBuilder;
var HandleableMiddleware = $traceurRuntime.assertObject(require('./handleable-middleware.js')).HandleableMiddleware;
var HandleableFilter = function HandleableFilter(handleableFilter) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  this._handleableFilter = handleableFilter;
  handleableFilter = safeHandler(handleableFilter, options);
  var middleware = (function(config, builder) {
    return builder(config).then((function(handleable) {
      return resolve(handleableFilter(config, handleable));
    }));
  });
  $traceurRuntime.superCall(this, $HandleableFilter.prototype, "constructor", [middleware, options]);
};
var $HandleableFilter = HandleableFilter;
($traceurRuntime.createClass)(HandleableFilter, {}, {}, HandleableMiddleware);
var handlerFilterClass = (function(filterType, filterKey, handlerKeys) {
  return (function($__super) {
    var HandlerFilter = function HandlerFilter(filter) {
      var $__2;
      var options = arguments[1] !== (void 0) ? arguments[1] : {};
      var $__1 = $traceurRuntime.assertObject(options),
          applyToHandlers = ($__2 = $__1.applyToHandlers) === void 0 ? handlerKeys : $__2;
      this[filterKey] = filter;
      filter = safeBuilder(filter, options);
      var handleableFilter = (function(config, handleable) {
        var newHandleable = copy(handleable);
        var promises = applyToHandlers.map((function(handlerKey) {
          var handler = handleable[handlerKey];
          if (!handler)
            return resolve();
          return filter(copy(config), handler).then((function(filteredHandler) {
            return newHandleable[handlerKey] = filteredHandler;
          }));
        }));
        return Promise.all(promises).then((function() {
          return newHandleable;
        }));
      });
      $traceurRuntime.superCall(this, HandlerFilter.prototype, "constructor", [handleableFilter, options]);
    };
    return ($traceurRuntime.createClass)(HandlerFilter, {get type() {
        return filterType;
      }}, {}, $__super);
  }(HandleableFilter));
});
var StreamFilter = handlerFilterClass('stream filter', '_streamFilter', ['streamHandler']);
var HttpFilter = handlerFilterClass('http filter', '_httpFilter', ['httpHandler']);
