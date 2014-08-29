import { streamToHttpHandler } from 'quiver-http'

var getStreamHandler = handleable =>
  handleable.streamHandler

var getHttpHandler = handleable => {
  var {
    httpHandler,
    streamHandler
  } = handleable

  if(httpHandler) return httpHandler

  if(streamHandler) 
    return streamToHttpHandler(streamHandler)

  return null
}

var createHandlerRouteIndex = getHandler => {
  var routeIndex = {
    staticRoutes: {},
    dynamicRoutes: []
  }

  var addStaticRoute = (path, handleable) => {
    var handler = getHandler(handleable)
    if(handler) {
      routeIndex.staticRoutes[path] = handler
    }
  }

  var addDynamicRoute = (matcher, handleable) => {
    var handler = getHandler(handleable)
    if(handler) {
      routeIndex.dynamicRoutes.push({ matcher, handler })
    }
  }

  var setDefaultRoute = handleable => {
    var handler = getHandler(handleable)
    if(handler) {
      routeIndex.defaultRoute = handler
    } 
  }

  return {
    addStaticRoute, addDynamicRoute, 
    setDefaultRoute, routeIndex
  }
}

export var createRouteIndex = () => {
  var stream = createHandlerRouteIndex(getStreamHandler)
  var http = createHandlerRouteIndex(getHttpHandler)

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