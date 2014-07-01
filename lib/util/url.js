export var combineUrlBuilders = (urlBuilder1, urlBuilder2) => {
  if(!url1 || !url2) return null

  return args => {
    var path1 = urlBuilder2(args)
    var oldPath = args.path
    args.path = path

    var path2 = urlBuilder1(args)
    args.path = oldPath

    return path2
  }
}

export var urlManagedBuilder = (handlerBuilder, urlBuilder) => {
  if(!urlBuilder) return handlerBuilder

  return config => {
    var newUrlBuilder = combineUrlBuilders(config.urlBuilder, urlBuilder)
    config.urlBuilder = newUrlBuilder

    return handlerBuilder(config).then(handleable => {
      handleable.urlBuilder = urlBuilder
      return handleable
    })
  }
}