import { copy } from 'quiver-object'
import { resolve } from 'quiver-promise'

import { safeHandler, safeBuilder } from './util/wrap.js'
import { HandleableMiddleware } from './handleable-middleware.js'

export var filterToHandleableFilter = (filter, handlerKey) =>
  (config, handleable) => {
    var handler = handleable[handlerKey]
    if(!handler) return resolve(handleable)

    return filter(config, handler).then(filteredHandler => {
      handleable[handlerKey] = filteredHandler
      return handleable
    })
  }

export var streamToHandleableFilter = filter =>
  filterToHandleableFilter(filter, 'streamHandler')

export var httpToHandleableFilter = filter =>
  filterToHandleableFilter(filter, 'httpHandler')

export var filterToMiddleware = filter =>
  (config, builder) =>
    builder(config).then(handler =>
      filter(config, handler))

export class HandleableFilter extends HandleableMiddleware {
  constructor(handleableFilter, options={}) {
    this._handleableFilter = handleableFilter

    this._handleableFilter = safeHandler(handleableFilter, options)

    super(null, options)
  }

  get mainMiddleware() {
    return filterToMiddleware(this.handleableFilter)
  }

  get handleableFilter() {
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

  get handleableFilter() {
    return streamToHandleableFilter(this.streamFilter)
  }

  get streamFilter() {
    var streamFilter = this._streamFilter

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

  get handleableFilter() {
    return httpToHandleableFilter(this.httpFilter)
  }

  get httpFilter() {
    var httpFilter = this._httpFilter

    if(!httpFilter) throw new Error(
      'streamFilter is not defined')

    return httpFilter
  }

  get type() {
    return 'Stream Filter'
  }
}

export var handleableFilter = (filter, options) =>
  new HandleableFilter(filter, options)

export var streamFilter = (filter, options) =>
  new StreamFilter(filter, options)

export var httpFilter = (filter, options) =>
  new HttpFilter(filter, options)