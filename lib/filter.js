import { copy } from 'quiver-object'
import { resolve } from 'quiver-promise'

import { safeHandler, safeBuilder } from './util/wrap.js'
import { HandleableMiddleware } from './handleable-middleware.js'

export class HandleableFilter extends HandleableMiddleware {
  constructor(handleableFilter, options={}) {
    this._handleableFilter = handleableFilter

    handleableFilter = safeHandler(handleableFilter, options)

    var middleware = (config, builder) =>
      builder(config).then(handleable =>
        Promise.resolve(handleableFilter(config, handleable)))

    super(middleware, options)
  }
}

var handlerFilterClass = (filterType, filterKey, handlerKeys) =>
  class HandlerFilter extends HandleableFilter {
    constructor(filter, options={}) {
      var { applyToHandlers=handlerKeys } = options

      this[filterKey] = filter
      
      filter = safeBuilder(filter, options)

      var handleableFilter = (config, handleable) => {
        var newHandleable = copy(handleable)

        var promises = applyToHandlers.map(handlerKey => {
          var handler = handleable[handlerKey]
          if(!handler) return resolve()

          return filter(copy(config), handler)
          .then(filteredHandler =>
            newHandleable[handlerKey] = filteredHandler)
        })

        return Promise.all(promises).then(() => newHandleable)
      }

      super(handleableFilter, options)
    }

    get type() {
      return filterType
    }
  }

export var StreamFilter = handlerFilterClass(
  'stream filter', '_streamFilter', ['streamHandler'])

export var HttpFilter = handlerFilterClass(
  'http filter', '_httpFilter', ['httpHandler'])
