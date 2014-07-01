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
  if (!url1 || !url2)
    return null;
  return (function(args) {
    var path1 = urlBuilder2(args);
    var oldPath = args.path;
    args.path = path;
    var path2 = urlBuilder1(args);
    args.path = oldPath;
    return path2;
  });
});
var urlManagedBuilder = (function(handlerBuilder, urlBuilder) {
  if (!urlBuilder)
    return handlerBuilder;
  return (function(config) {
    var newUrlBuilder = combineUrlBuilders(config.urlBuilder, urlBuilder);
    config.urlBuilder = newUrlBuilder;
    return handlerBuilder(config).then((function(handleable) {
      handleable.urlBuilder = urlBuilder;
      return handleable;
    }));
  });
});
