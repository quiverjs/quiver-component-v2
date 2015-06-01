import { copy } from 'quiver-object'
import { resolve } from 'quiver-promise'
import { streamToHttpHandler } from 'quiver-http'

import { safeHandler, safeBuilder } from './util/wrap'
import { HandleableMiddleware } from './handleable-middleware'

const _copyConfig = Symbol('_copyConfig')
const _httpFilter = Symbol('_httpFilter')
const _streamFilter = Symbol('_streamFilter')
const _handleableFilter = Symbol('_handleableFilter')

const noCopy = config => config

export const filterToHandleableFilter = (filter, handlerKey) =>
  async function(config, handleable) {
    const handler = handleable[handlerKey]
    if(!handler) return resolve(handleable)

    const filteredHandler = await filter(config, handler)
    handleable[handlerKey] = filteredHandler
    
    return handleable
  }

export const streamToHandleableFilter = filter =>
  filterToHandleableFilter(filter, 'streamHandler')

export const httpToHandleableFilter = filter =>
  filterToHandleableFilter(filter, 'httpHandler')

export const filterToMiddleware = (filter, copyConfig) =>
  (config, builder) =>
    builder(copyConfig(config)).then(handler =>
      filter(config, handler))

export class HandleableFilter extends HandleableMiddleware {
  constructor(handleableFilter, options={}) {
    super(null, options)

    const { copyConfig=true } = options
    this[_copyConfig] = copyConfig

    this[_handleableFilter] = handleableFilter
  }

  toMainHandleableMiddleware() {
    const copyConfig = this[_copyConfig] ? copy : noCopy
    const handleableFilter = this.toHandleableFilter()

    return filterToMiddleware(
      handleableFilter, copyConfig)
  }

  toHandleableFilter() {
    return safeHandler(this[_handleableFilter])
  }

  get componentType() {
    return 'HandleableFilter'
  }
}

export class StreamFilter extends HandleableFilter {
  constructor(streamFilter, options={}) {
    super(null, options)

    this[_streamFilter] = streamFilter
  }

  toHandleableFilter() {
    const streamFilter = this.toStreamFilter()

    return async function(config, handleable) {
      const handler = handleable.streamHandler
      if(!handler) return resolve(handleable)

      const filteredHandler = await streamFilter(config, handler)
      handleable.streamHandler = filteredHandler
      return handleable
    }
  }

  toStreamFilter() {
    return safeBuilder(this[_streamFilter])
  }

  get componentType() {
    return 'StreamFilter'
  }
}

export class HttpFilter extends HandleableFilter {
  constructor(httpFilter, options={}) {
    super(null, options)

    this[_httpFilter] = httpFilter
  }

  toHandleableFilter() {
    const httpFilter = this.toHttpFilter()

    return async function(config, handleable) {
      let httpHandler = handleable.httpHandler
      if(!httpHandler) {
        const streamHandler = handleable.streamHandler

        if(!streamHandler)
          return resolve(handleable)

        httpHandler = streamToHttpHandler(streamHandler)
        handleable = { httpHandler }
      }

      const filteredHandler = await httpFilter(config, httpHandler)
      handleable.httpHandler = filteredHandler

      return handleable
    }
  }

  toHttpFilter() {
    return safeBuilder(this[_httpFilter])
  }

  get componentType() {
    return 'HttpFilter'
  }
}

export const handleableFilter = (filter, options) =>
  new HandleableFilter(filter, options)

export const streamFilter = (filter, options) =>
  new StreamFilter(filter, options)

export const httpFilter = (filter, options) =>
  new HttpFilter(filter, options)
