export var combineUrlBuilders = (urlBuilder1, urlBuilder2) => {
  if(!urlBuilder1 || !urlBuilder2) return null

  return (args, restPath='/') => {
    var newRestPath = urlBuilder2(args, restPath)

    return urlBuilder1(args, newRestPath)
  }
}

var loaderBuilder = component =>
  config => component.loadHandleable(config)

export var urlManagedBuilder = (component, urlBuilder) => {
  if(!urlBuilder) return loaderBuilder(component)

  return config => {
    var newUrlBuilder = combineUrlBuilders(config.urlBuilder, urlBuilder)
    config.urlBuilder = newUrlBuilder

    return component.loadHandleable(config).then(handleable => {
      if(!handleable.urlBuilder) {
        handleable.urlBuilder = newUrlBuilder
      }

      return handleable
    })
  }
}