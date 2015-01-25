import { copy } from 'quiver-object'
import { error } from 'quiver-error'
import { async, reject } from 'quiver-promise'
import { streamToHttpHandler } from 'quiver-http'

let getHandlerFromPath = (routeIndex, path, args) => {
  let staticHandler = routeIndex.staticRoutes[path]
  if(staticHandler) return staticHandler

  let dynamicRoutes = routeIndex.dynamicRoutes

  for(let route of dynamicRoutes) {
    let matched = route.matcher(path, args)
    if(matched) return route.handler
  }

  if(routeIndex.defaultRoute)
    return routeIndex.defaultRoute

  return null
}

let httpRouterHandler = routeIndex =>
  (requestHead, requestStreamable) => {
    let { args, path } = requestHead

    let handler = getHandlerFromPath(routeIndex, path, args)
    if(!handler) return reject(error(404, 'not found'))

    return handler(requestHead, requestStreamable)
  }

let streamRouterHandler = routeIndex =>
  (args, streamable) => {
    let { path='/' } = args

    let handler = getHandlerFromPath(routeIndex, path, args)
    if(!handler) return reject(error(404, 'not found'))

    return handler(args, streamable)
  }

let handleableToStreamHandler = handleable =>
  handleable.streamHandler

let handleableToHttpHandler = handleable => {
  if(handleable.httpHandler) 
    return handleable.httpHandler

  if(handleable.streamHandler)
    return streamToHttpHandler(
      handleable.streamHandler)

  return null
}

let routeSpecsToRouteIndex = (routeSpecs, getHandler) => {
  let staticRoutes = {}
  let dynamicRoutes = []
  let defaultRoute = null

  routeSpecs.forEach(routeSpec => {
    let { routeType, handleable } = routeSpec

    let handler = getHandler(handleable)
    if(!handler) return

    if(routeType == 'static') {
      let { path } = routeSpec
      staticRoutes[path] = handler

    } else if(routeType == 'dynamic') {
      let { matcher } = routeSpec
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

export let routeSpecsToRouterHandleable = routeSpecs => {
  let streamIndex = routeSpecsToRouteIndex(routeSpecs,
    handleableToStreamHandler)

  let httpIndex = routeSpecsToRouteIndex(routeSpecs,
    handleableToHttpHandler)

  let streamHandler = streamRouterHandler(streamIndex)
  let httpHandler = httpRouterHandler(httpIndex)

  return {
    streamHandler,
    httpHandler
  }
}

let routeBuildSpecsToRouteSpecs = async(
function*(config, routeBuildSpecs) {
  let routeSpecs = []

  for(let i=0; i<routeBuildSpecs.length; i++) {
    let routeBuildSpec = routeBuildSpecs[i]
    let builder = routeBuildSpec.builder
    let routeSpec = copy(routeBuildSpec)

    routeSpec.handleable = yield builder(config)
    routeSpecs.push(routeSpec)
  }

  return routeSpecs
})

export let routeBuildSpecsToRouterBuilder = routeBuildSpecs =>
  async(function*(config) {
    let routeSpecs = yield routeBuildSpecsToRouteSpecs(
      config, routeBuildSpecs)

    return routeSpecsToRouterHandleable(routeSpecs)
  })