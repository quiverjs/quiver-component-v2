import { copy } from 'quiver-object'
import { resolve } from 'quiver-promise'
import { HandleableMiddleware } from './handleable-middleware.js'
import { safeHandler } from './util/wrap.js'

export class ConfigMiddleware extends HandleableMiddleware {
  constructor(configHandler, options={}) {
    this._configHandler = safeHandler(configHandler, options)

    super(null, options)
  }

  get mainMiddleware() {
    var configHandler = this.configHandler

    return (config, builder) =>
      configHandler(config).then(builder)
  }

  get configHandler() {
    if(!this._configHandler) throw new Error(
      'configHandler is not defined')

    return this._configHandler
  }

  get type() {
    return 'config middleware'
  }
}

export class ConfigOverrideMiddleware extends ConfigMiddleware {
  constructor(overrideConfig, options={}) {
    this._overrideConfig = overrideConfig
    options.safeWrapped = true

    super(null, options)
  }

  get configHandler() {
    var overrideConfig = this.overrideConfig

    return config => {
      for(var key in overrideConfig) {
        config[key] = overrideConfig[key]
      }

      return resolve(config)
    }
  }

  get overrideConfig() {
    return this._overrideConfig
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