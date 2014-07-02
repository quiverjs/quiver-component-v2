import { resolve, reject } from 'quiver-promise'
import {
  streamToSimpleHandler, validateSimpleTypes
} from 'quiver-simple-handler'

import { getHandlerMap } from './config.js'

export var loadHandleable = (config, key, builder, options={}) => {
  var handlerMap = getHandlerMap(config)

  var handleable = handlerMap.get(key)
  if(handleable) return resolve(handleable)
  
  return builder(config).then(handleable => {
    if(!handleable) return reject(new Error(
      'handleable is not defined in builder result'))

    handlerMap.set(key, handleable)

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

export var loadSimpleHandler = (config, key, builder, options={}) =>  {
  var { inType, outType } = options

  var err = validateSimpleTypes([inType, outType])
  if(err) return reject(err)

  return loadStreamHandler(config, key, builder, options)
  .then(handler => streamToSimpleHandler(handler, inType, outType))
}