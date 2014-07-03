
var createHandlerRouteIndex = handlerKey => {
  var routeIndex = {
    staticRoutes: {},
    dynamicRoutes: []
  }

  var addStaticRoute = (path, handleable) => {
    var handler = handleable[handlerKey]
    if(handler) {
      routeIndex.staticRoutes[path] = handler
    }
  }

  var addDynamicRoute = (matcher, handleable) => {
    var handler = handleable[handlerKey]
    if(handler) {
      routeIndex.dynamicRoutes.push({ matcher, handler })
    }
  }

  var setDefaultRoute = handleable => {
    var handler = handleable[handlerKey]
    if(handler) {
      routeIndex.defaultRoute = handler
    } 
  }

  return {
    addStaticRoute, addDynamicRoute, setDefaultRoute, routeIndex
  }
}

export var createRouteIndex = () => {
  var stream = createHandlerRouteIndex('streamHandler')
  var http = createHandlerRouteIndex('httpHandler')

  var addStaticRoute = (path, handleable) => {
    stream.addStaticRoute(path, handleable)
    http.addStaticRoute(path, handleable)
  }

  var addDynamicRoute = (matcher, handleable) => {
    stream.addDynamicRoute(matcher, handleable)
    http.addDynamicRoute(matcher, handleable)
  }

  var setDefaultRoute = handleable => {
    stream.setDefaultRoute(handleable)
    http.setDefaultRoute(handleable)
  }

  return {
    addStaticRoute, addDynamicRoute, setDefaultRoute, 
    stream, http
  }
}