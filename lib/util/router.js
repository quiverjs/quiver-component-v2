import { error } from 'quiver-error'
import { parse as parseUrl } from 'url'

var getPathFromRequestHead = function(requestHead) {
  if(!requestHead.args) requestHead.args = { }

  if(requestHead.args.path) {
    return requestHead.args.path
  }

  var path = parseUrl(requestHead.url, true).pathname
  requestHead.args.path = path
}

var getHandlerFromPath = (routeIndex, path) => {
  var staticHandler = routeIndex.staticRoutes[path]

  if(staticHandler) {
    return {
      matchedArgs: { },
      handler: staticHandler
    }
  }

  var dynamicRoutes = routeIndex.dynamicRoutes

  for(var route of dynamicRoutes) {
    var matchedArgs = route.matcher(path)

    if(matchedArgs) {
      return {
        matchedArgs: matchedArgs,
        handler: dynamicRoutes[i].handler
      }
    }
  }

  if(routeIndex.defaultRoute) {
    return {
      matchedArgs: { },
      handler: routeIndex.defaultRoute
    }
  }

  return null
}

var httpRouterHandler = routeIndex =>
  (requestHead, requestStreamable) => {
    var path = getPathFromRequestHead(requestHead)

    var result = getHandlerFromPath(path, routeIndex)
    if(!result) return reject(error(404, 'not found'))

    var { handler, matchedArgs } = result

    var args = requestHead.args

    for(var key in matchedArgs) {
      args[key] = matchedArgs[key]
    }

    return handler(requestHead, requestStreamable)
  }

var streamRouterHandler = routeIndex =>
  (args, inputStreamable) => {
    var path = args.path || '/'

    var result = getHandlerFromPath(path, routeIndex)
    if(!result) return reject(error(404, 'not found'))

    var { handler, matchedArgs } = result

    for(var key in matchedArgs) {
      args[key] = matchedArgs[key]
    }

    return handler(args, inputStreamable)
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