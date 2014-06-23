import { HandleableMiddleware } from './handleable-middleware.js'
import { resolve } from 'quiver-promise'

export class HandleableFilter extends HandleableMiddleware {
  constructor(handleableFilter, options) {
    this._handleableFilter = handleableFilter

    var middleware = (config, builder) =>
      builder(config).then(handleable =>
        Promise.resolve(handleableFilter(config, handleable)))

    super(middleware, options)
  }
}

var createHandlerFilterClass = filterKey, handlerKeys =>
  class HandlerFilter extends HandleableFilter {
    constructor(filter, options) {
      var { applyToHandlers=handlerKeys } = options

      this[filterKey] = filter

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

      options.copyConfig = false

      super(handleableFilter, options)
    }
  }

export var StreamFilter = createHandlerFilterClass('_streamFilter', ['streamHandler'])
export var HttpFilter = createHandlerFilterClass('_httpFilter', ['httpHandler'])
