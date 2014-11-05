import { error } from 'quiver-error'
import { resolve, async } from 'quiver-promise'
import { emptyStreamable } from 'quiver-stream-util'

import {
  ResponseHead, streamToHttpHandler 
} from 'quiver-http'

import { HttpHandlerBuilder } from '../http-handler'

import { 
  loadHandleable
} from '../util/loader'

var headRequestHandler = handler =>
  (requestHead, requestStreamable) => {
    if(requestHead.method != 'HEAD') {
      return handler(requestHead, requestStreamable)
    }

    return handler(requestHead, requestStreamable)
    .then(([responseHead, responseStreamable]) =>
      ([responseHead, emptyStreamable()]))
  }

var optionsHandler = methods => {
  var allowedMethods = methods.join(', ') + ', OPTIONS'

  return (requestHead, requestStreamable) => 
    resolve([
      new ResponseHead({
        statusCode: 200,
        headers: {
          'content-length': '0',
          allow: allowedMethods
        }
      }),
      emptyStreamable()
    ])
}

var methodMapToHttpHandler = methodMap => {
  var allowedMethods = Object.keys(methodMap).join(', ')

  var methodNotAllowedResponse = () => ([
    new ResponseHead({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
      headers: {
        'content-length': '0',
        allow: allowedMethods
      }
    }),
    emptyStreamable()
  ])

  return (requestHead, requestStreamable) => {
    var method = requestHead.method
    var handler = methodMap[method]

    if(!handler) return methodNotAllowedResponse()

    return handler(requestHead, requestStreamable)
  }
}

var loadHttpHandler = async(
function*(config, component) {
  var handleable = yield loadHandleable(config, component)

  if(handleable.httpHandler) 
    return handleable.httpHandler

  if(handleable.streamHandler)
    return streamToHttpHandler(handleable.streamHandler)

  throw error(500, 'handleable is neither stream nor http handler')
})

var loadMethodHandlers = async(
function*(config, methodMap) {
  var handlerMap = { }

  for(var key in methodMap) {
    var component = methodMap[key]
    var handler = yield loadHttpHandler(config, component)

    handlerMap[key] = handler
  }

  if(handlerMap['GET'] && !handlerMap['HEAD']) {
    handlerMap['HEAD'] = headRequestHandler(handlerMap['GET'])
  }

  if(!handlerMap['OPTIONS']) {
    handlerMap['OPTIONS'] = optionsHandler(Object.keys(handlerMap))
  }

  return handlerMap
})

var normalizeMethodMap = methodMap => {
  var newMap = { }

  for(var key in methodMap) {
    newMap[key.toUpperCase()] = methodMap[key]
  }

  return newMap
}

export class MethodRouter extends HttpHandlerBuilder {
  constructor(methodMap, options={}) {
    this._methodMap = normalizeMethodMap(methodMap)
    options.safeWrapped = true

    super(null, options)
  }

  get httpHandlerBuilder() {
    var methodMap = this._methodMap

    return config =>
      loadMethodHandlers(config, methodMap)
      .then(methodMapToHttpHandler)
  }

  privatize(privateInstance, privateTable) {
    var methodMap = this._methodMap
    var privateMap = { }

    for(var key in methodMap) {
      privateMap[key] = methodMap[key]
        .makePrivate(privateTable)
    }

    privateInstance._methodMap = privateMap

    super.privatize(privateInstance, privateTable)
  }
}

export var methodRouter = methodMap =>
  new MethodRouter(methodMap)