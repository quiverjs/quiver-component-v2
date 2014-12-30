import { resolve, reject } from 'quiver-promise'
import {
  streamToSimpleHandler, validateSimpleTypes
} from 'quiver-simple-handler'

import { getHandlerMap } from './config'

export var loadHandleable = 
(config, componentId, builder) => {
  var handlerMap = getHandlerMap(config)

  var handleable = handlerMap[componentId]
  if(handleable) return resolve(handleable)

  return builder(config).then(handleable => {
    if(!handleable) return reject(new Error(
      'handleable is not defined in builder result'))

    handlerMap[componentId] = handleable

    return handleable
  })
}

export var loadStreamHandler = (...args) =>
  loadHandleable(...args).then(handleable => {
    var handler = handleable.streamHandler
    if(!handler) return reject(new Error(
      'handleable is not a stream handler'))

    return handler
  })

export var loadHttpHandler = (...args) =>
  loadHandleable(...args).then(handleable => {
    var handler = handleable.httpHandler
    if(!handler) return reject(new Error(
      'handleable is not a http handler'))

    return handler
  })

export var loadSimpleHandler = 
(config, componentId, builder, inType, outType) =>  {
  var err = validateSimpleTypes([inType, outType])
  if(err) return reject(err)

  return loadStreamHandler(config, componentId, builder)
  .then(handler => 
    streamToSimpleHandler(handler, inType, outType))
}

export var simpleHandlerLoader = (inType, outType) =>
  (config, componentId, builder) =>
    loadSimpleHandler(config, componentId, builder, inType, outType)