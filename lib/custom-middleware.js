import { HandleableMiddleware } from './handleable-middleware.js'
import { safePromised } from 'quiver-promise'

export class ConfigMiddleware extends HandleableMiddleware {
  constructor(configHandler, options) {
    this._configHandler = configHandler

    configHandler = safePromised(configHandler)
    var middleware = (config, builder) =>
      configHandler(config).then(builder)

    super(middleware, options)
  }
}
