"use strict";
Object.defineProperties(exports, {
  filterToMiddleware: {get: function() {
      return filterToMiddleware;
    }},
  __esModule: {value: true}
});
var filterToMiddleware = (function(filter) {
  return (function(config, builder) {
    return builder(config).then((function(handler) {
      return filter(config, handler);
    }));
  });
});
