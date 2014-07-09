import { copy } from 'quiver-object'
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

  get type() {
    return 'config middleware'
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

  get overrideConfig() {
    return copy(this._overrideConfig)
  }

  get type() {
    return 'config override middleware'
  }

  toJson() {
    var json = super.toJson()

    json.overrideConfig = this.overrideConfig
    return json
  }
}

export var configMiddleware = (handler, options) =>
  new ConfigMiddleware(handler, options)

export var configOverrideMiddleware = (config, options) =>
  new ConfigOverrideMiddleware(config, options)