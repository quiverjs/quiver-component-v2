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

let headRequestHandler = handler =>
  (requestHead, requestStreamable) => {
    if(requestHead.method != 'HEAD') {
      return handler(requestHead, requestStreamable)
    }

    return handler(requestHead, requestStreamable)
    .then(([responseHead, responseStreamable]) =>
      ([responseHead, emptyStreamable()]))
  }

let optionsHandler = methods => {
  let allowedMethods = methods.join(', ') + ', OPTIONS'

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

let methodMapToHttpHandler = methodMap => {
  let allowedMethods = Object.keys(methodMap).join(', ')

  let methodNotAllowedResponse = () => ([
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
    let method = requestHead.method
    let handler = methodMap[method]

    if(!handler) return methodNotAllowedResponse()

    return handler(requestHead, requestStreamable)
  }
}

let loadHttpHandler = async(
function*(config, component) {
  let handleable = yield loadHandleable(config, component.id, 
      component.builder)

  if(handleable.httpHandler) 
    return handleable.httpHandler

  if(handleable.streamHandler)
    return streamToHttpHandler(handleable.streamHandler)

  throw error(500, 'handleable is neither stream nor http handler')
})

let loadMethodHandlers = async(
function*(config, methodMap) {
  let handlerMap = { }

  for(let key in methodMap) {
    let component = methodMap[key]

    let handler = yield loadHttpHandler(config, component)

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

let normalizeMethodMap = methodMap => {
  let newMap = { }

  for(let key in methodMap) {
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

  toHttpHandlerBuilder() {
    let methodMap = this._methodMap

    let snapshot = {}
    for(let key in methodMap) {
      let component = methodMap[key]

      snapshot[key] = {
        id: component.id,
        builder: component.toHandleableBuilder()
      }
    }

    return config =>
      loadMethodHandlers(config, snapshot)
      .then(methodMapToHttpHandler)
  }

  each(iteratee) {
    let methodMap = this._methodMap
    for(let key in methodMap) {
      iteratee(methodMap[key])
    }
    
    super.each(iteratee)
  }

  doMap(target, mapper, mapTable) {
    let methodMap = this._methodMap
    let newMap = { }

    for(let key in methodMap) {
      newMap[key] = mapper(methodMap[key], mapTable)
    }

    target._methodMap = newMap

    super.doMap(target, mapper, mapTable)
  }
}

export let methodRouter = methodMap =>
  new MethodRouter(methodMap)