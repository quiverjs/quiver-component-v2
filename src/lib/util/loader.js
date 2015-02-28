import { resolve, reject } from 'quiver-promise'
import {
  streamToSimpleHandler, validateSimpleTypes
} from 'quiver-simple-handler'

import { getHandlerMap } from './config'

export let loadHandleable = 
(config, componentId, builder) => {
  let handlerMap = getHandlerMap(config)

  let handleable = handlerMap[componentId]
  if(handleable) return resolve(handleable)

  return builder(config).then(handleable => {
    if(!handleable) return reject(new Error(
      'handleable is not defined in builder result'))

    handlerMap[componentId] = handleable

    return handleable
  })
}

export let loadStreamHandler = (...args) =>
  loadHandleable(...args).then(handleable => {
    let handler = handleable.streamHandler
    if(!handler) return reject(new Error(
      'handleable is not a stream handler'))

    return handler
  })

export let loadHttpHandler = (...args) =>
  loadHandleable(...args).then(handleable => {
    let handler = handleable.httpHandler
    if(!handler) return reject(new Error(
      'handleable is not a http handler'))

    return handler
  })

export let loadSimpleHandler = 
(config, componentId, builder, inType, outType) =>  {
  let err = validateSimpleTypes([inType, outType])
  if(err) return reject(err)

  return loadStreamHandler(config, componentId, builder)
  .then(handler => 
    streamToSimpleHandler(handler, inType, outType))
}

export let simpleHandlerLoader = (inType, outType) =>
  (config, componentId, builder) =>
    loadSimpleHandler(config, componentId, builder, inType, outType)