import { HandleableMiddleware } from './handleable-middleware.js'
import { safeHandler } from './util/wrap.js'

export class ConfigMiddleware extends HandleableMiddleware {
  constructor(configHandler, options={}) {
    this._configHandler = configHandler

    configHandler = safeHandler(configHandler, {})
    var middleware = (config, builder) =>
      configHandler(config).then(builder)

    super(middleware, options)
  }
}

export class ConfigOverrideMiddleware extends ConfigMiddleware {
  constructor(overrideConfig, options={}) {
    this._overrideConfig = overrideConfig

    var configHandler = config => {
      for(var key in overrideConfig) {
        config[key] = overrideConfig[key]
      }

      return config
    }

    super(configHandler, options)
  }
}