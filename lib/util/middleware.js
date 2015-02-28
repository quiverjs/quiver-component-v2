import { getInitTable } from './config'

let noopMiddleware = (config, builder) => builder(config)

export let combineBuilderWithMiddleware = (builder, middleware) =>
  config => middleware(config, builder)

export let combineBuilderWithMiddlewares = (builder, middlewares) =>
  middlewares.reduce(combineBuilderWithMiddleware, builder)

export let combineTwoMiddlewares = (middleware1, middleware2) =>
  (config, builder) => middleware2(config, 
    combineBuilderWithMiddleware(builder, middleware1))

export let combineMiddlewares = middlewares => {
  let count = middlewares.length
  
  if(count==0) return noopMiddleware
  if(count==1) return middlewares[0]

  return middlewares.slice(1).reduce(
    combineTwoMiddlewares, middlewares[0])
}

export let combineMiddlewareComponents = components =>
  combineMiddlewares(components.map(component => 
    component.toHandleableMiddleware()))