import { error } from 'quiver-error'
import { parse as parseUrl } from 'url'
import { reject } from 'quiver-promise'

var getHandlerFromPath = (routeIndex, path, args) => {
  var staticHandler = routeIndex.staticRoutes[path]
  if(staticHandler) return staticHandler

  var dynamicRoutes = routeIndex.dynamicRoutes

  for(var route of dynamicRoutes) {
    var matched = route.matcher(path, args)
    if(matched) return route.handler
  }

  if(routeIndex.defaultRoute)
    return routeIndex.defaultRoute

  return null
}

var httpRouterHandler = routeIndex =>
  (requestHead, requestStreamable) => {
    var { args, path } = requestHead

    var handler = getHandlerFromPath(routeIndex, path, args)
    if(!handler) return reject(error(404, 'not found'))

    return handler(requestHead, requestStreamable)
  }

var streamRouterHandler = routeIndex =>
  (args, streamable) => {
    var { path='/' } = args

    var handler = getHandlerFromPath(routeIndex, path, args)
    if(!handler) return reject(error(404, 'not found'))

    return handler(args, streamable)
  }

export var routerHandleable = indexes => {
  var streamHandler = streamRouterHandler(indexes.stream.routeIndex)
  var httpHandler = httpRouterHandler(indexes.http.routeIndex)

  return {
    get streamHandler() {
      return streamHandler
    },

    get httpHandler() {
      return httpHandler
    }
  }
}