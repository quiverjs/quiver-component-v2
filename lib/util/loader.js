import { resolve, reject } from 'quiver-promise'
import {
  streamToSimpleHandler, validateSimpleTypes
} from 'quiver-simple-handler'

import { getHandlerMap } from './config.js'

export var loadHandleable = (config, component, options={}) => {
  var { loadPrivate=false } = options

  if(!loadPrivate) {
    var handlerMap = getHandlerMap(config)

    var handleable = handlerMap.get(component)
    if(handleable) return resolve(handleable)
  }
  
  var builder = component.handleableBuilder

  return builder(config).then(handleable => {
    if(!handleable) return reject(new Error(
      'handleable is not defined in builder result'))

    handlerMap.set(component, handleable)

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

export var loadSimpleHandler = (config, component, inType, outType, options) =>  {
  var err = validateSimpleTypes([inType, outType])
  if(err) return reject(err)

  return loadStreamHandler(config, component, options)
    .then(handler => 
      streamToSimpleHandler(handler, inType, outType))
}