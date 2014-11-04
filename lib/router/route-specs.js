import { copy } from 'quiver-object'
import { error } from 'quiver-error'
import { async, reject } from 'quiver-promise'
import { streamToHttpHandler } from 'quiver-http'

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

var handleableToStreamHandler = handleable =>
  handleable.streamHandler

var handleableToHttpHandler = handleable => {
  if(handleable.httpHandler) 
    return handleable.httpHandler

  if(handleable.streamHandler)
    return streamToHttpHandler(
      handleable.streamHandler)

  return null
}

var routeSpecsToRouteIndex = (routeSpecs, getHandler) => {
  var staticRoutes = {}
  var dynamicRoutes = []
  var defaultRoute = null

  routeSpecs.forEach(routeSpec => {
    var { routeType, handleable } = routeSpec

    var handler = getHandler(handleable)
    if(!handler) return

    if(routeType == 'static') {
      var { path } = routeSpec
      staticRoutes[path] = handler

    } else if(routeType == 'dynamic') {
      var { matcher } = routeSpec
      dynamicRoutes.push({ matcher, handler })

    } else if(routeType == 'default') {
      defaultRoute = handler
    }
  })

  return {
    staticRoutes,
    dynamicRoutes,
    defaultRoute
  }
}

export var routeSpecsToRouterHandleable = routeSpecs => {
  var streamIndex = routeSpecsToRouteIndex(routeSpecs,
    handleableToStreamHandler)

  var httpIndex = routeSpecsToRouteIndex(routeSpecs,
    handleableToHttpHandler)

  var streamHandler = streamRouterHandler(streamIndex)
  var httpHandler = httpRouterHandler(httpIndex)

  return {
    streamHandler,
    httpHandler
  }
}

var routeBuildSpecsToRouteSpecs = async(
function*(config, routeBuildSpecs) {
  var routeSpecs = []

  for(var i=0; i<routeBuildSpecs.length; i++) {
    var routeBuildSpec = routeBuildSpecs[i]
    var builder = routeBuildSpec.builder
    var routeSpec = copy(routeBuildSpec)

    routeSpec.handleable = yield builder(config)
    routeSpecs.push(routeSpec)
  }

  return routeSpecs
})

export var routeBuildSpecsToRouterBuilder = routeBuildSpecs =>
  async(function*(config) {
    var routeSpecs = yield routeBuildSpecsToRouteSpecs(
      config, routeBuildSpecs)

    return routeSpecsToRouterHandleable(routeSpecs)
  })