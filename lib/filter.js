import { copy } from 'quiver-object'
import { resolve } from 'quiver-promise'
import { streamToHttpHandler } from 'quiver-http'

import { safeHandler, safeBuilder } from './util/wrap'
import { HandleableMiddleware } from './handleable-middleware'

let noCopy = config => config

export let filterToHandleableFilter = (filter, handlerKey) =>
  (config, handleable) => {
    let handler = handleable[handlerKey]
    if(!handler) return resolve(handleable)

    return filter(config, handler).then(filteredHandler => {
      handleable[handlerKey] = filteredHandler
      return handleable
    })
  }

export let streamToHandleableFilter = filter =>
  filterToHandleableFilter(filter, 'streamHandler')

export let httpToHandleableFilter = filter =>
  filterToHandleableFilter(filter, 'httpHandler')

export let filterToMiddleware = (filter, copyConfig) =>
  (config, builder) =>
    builder(copyConfig(config)).then(handler =>
      filter(config, handler))

export class HandleableFilter extends HandleableMiddleware {
  constructor(handleableFilter, options={}) {
    let { copyConfig=true } = options
    this._copyConfig = copyConfig

    this._handleableFilter = handleableFilter
    this._handleableFilter = safeHandler(handleableFilter, options)

    super(null, options)
  }

  toMainHandleableMiddleware() {
    let copyConfig = this._copyConfig ? copy : noCopy
    let handleableFilter = this.toHandleableFilter()

    return filterToMiddleware(
      handleableFilter, copyConfig)
  }

  toHandleableFilter() {
    if(!this._handleableFilter) throw new Error(
      'handleableFilter is not defined')

    return this._handleableFilter
  }
}

export class StreamFilter extends HandleableFilter {
  constructor(filter, options={}) {
    this._streamFilter = safeBuilder(filter, options)

    super(null, options)
  }

  toHandleableFilter() {
    let streamFilter = this.toStreamFilter()

    return (config, handleable) => {
      let handler = handleable.streamHandler
      if(!handler) return resolve(handleable)

      return streamFilter(config, handler)
      .then(filteredHandler => {
        handleable.streamHandler = filteredHandler
        return handleable
      })
    }
  }

  toStreamFilter() {
    let streamFilter = this._streamFilter

    if(!streamFilter) throw new Error(
      'streamFilter is not defined')

    return streamFilter
  }

  get type() {
    return 'Stream Filter'
  }
}

export class HttpFilter extends HandleableFilter {
  constructor(filter, options={}) {
    this._httpFilter = safeBuilder(filter, options)

    super(null, options)
  }

  toHandleableFilter() {
    let httpFilter = this.toHttpFilter()

    return (config, handleable) => {
      let httpHandler = handleable.httpHandler
      if(!httpHandler) {
        let streamHandler = handleable.streamHandler

        if(!streamHandler)
          return resolve(handleable)

        httpHandler = streamToHttpHandler(streamHandler)
        handleable = { httpHandler }
      }

      return httpFilter(config, httpHandler)
      .then(filteredHandler => {
        handleable.httpHandler = filteredHandler
        return handleable
      })
    }
  }

  toHttpFilter() {
    let httpFilter = this._httpFilter

    if(!httpFilter) throw new Error(
      'httpFilter is not defined')

    return httpFilter
  }

  get type() {
    return 'Http Filter'
  }
}

export let handleableFilter = (filter, options) =>
  new HandleableFilter(filter, options)

export let streamFilter = (filter, options) =>
  new StreamFilter(filter, options)

export let httpFilter = (filter, options) =>
  new HttpFilter(filter, options)