"use strict";
Object.defineProperties(exports, {
  combineUrlBuilders: {get: function() {
      return combineUrlBuilders;
    }},
  urlManagedBuilder: {get: function() {
      return urlManagedBuilder;
    }},
  __esModule: {value: true}
});
var combineUrlBuilders = (function(urlBuilder1, urlBuilder2) {
  if (!urlBuilder1 || !urlBuilder2)
    return null;
  return (function(args) {
    var restPath = arguments[1] !== (void 0) ? arguments[1] : '/';
    var newRestPath = urlBuilder2(args, restPath);
    return urlBuilder1(args, newRestPath);
  });
});
var loaderBuilder = (function(component) {
  return (function(config) {
    return component.loadHandleable(config);
  });
});
var urlManagedBuilder = (function(component, urlBuilder) {
  if (!urlBuilder)
    return loaderBuilder(component);
  return (function(config) {
    var newUrlBuilder = combineUrlBuilders(config.urlBuilder, urlBuilder);
    config.urlBuilder = newUrlBuilder;
    return component.loadHandleable(config).then((function(handleable) {
      if (!handleable.urlBuilder) {
        handleable.urlBuilder = newUrlBuilder;
      }
      return handleable;
    }));
  });
});
