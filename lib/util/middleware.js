import { getInitTable } from './config.js'

var noopMiddleware = (config, builder) => builder(config)

export var combineBuilderWithMiddleware = (builder, middleware) =>
  config => middleware(config, builder)

export var combineBuilderWithMiddlewares = (builder, middlewares) =>
  middlewares.reduce(combineBuilderWithMiddleware, builder)

export var combineTwoMiddlewares = (middleware1, middleware2) =>
  (config, builder) => middleware2(config, 
    combineBuilderWithMiddleware(builder, middleware1))

export var combineMiddlewares = middlewares => {
  var count = middlewares.length
  
  if(count==0) return noopMiddleware
  if(count==1) return middlewares[0]

  return middlewares.slice(1).reduce(
    combineTwoMiddlewares, middlewares[0])
}

export var combineMiddlewareComponents = components =>
  combineMiddlewares(components.map(component => 
    component.handleableMiddleware))

export var repeatOnceMiddleware = (id, middleware) =>
  (config, builder) => {
    var initTable = getInitTable(config)
    if(initTable[id]) return builder(config)

    return middleware(config, builder)
  }
