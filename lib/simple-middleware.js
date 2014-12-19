import { copy } from 'quiver-object'
import { resolve } from 'quiver-promise'

import { safeHandler } from './util/wrap'
import { HandleableMiddleware } from './handleable-middleware'
import { 
  ExtensibleHandler, ExtensibleMiddleware 
} from './extensible-component'

var configHandlerToMiddleware = configHandler =>
  (config, builder) =>
    configHandler(config)
    .then((newConfig=config) =>
      builder(newConfig))

export class ConfigMiddleware extends HandleableMiddleware {
  constructor(configHandler, options={}) {
    this._configHandler = safeHandler(configHandler, options)

    super(null, options)
  }

  toMainHandleableMiddleware() {
    var configHandler = this.toConfigHandler()

    return configHandlerToMiddleware(configHandler)
  }

  toConfigHandler() {
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

  toConfigHandler() {
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

export class ConfigAliasMiddleware extends ConfigMiddleware {
  constructor(aliasConfig, options={}) {
    this._aliasConfig = aliasConfig
    options.safeWrapped = true

    super(null, options)
  }

  toConfigHandler() {
    var aliasConfig = this._aliasConfig

    return config => {
      for(var key in aliasConfig) {
        var aliasKey = aliasConfig[key]
        config[key] = config[aliasKey]
      }

      return resolve(config)
    }
  }

  get aliasConfig() {
    return copy(this._aliasConfig)
  }

  get type() {
    return 'config alias middleware'
  }

  toJson() {
    var json = super.toJson()

    json.aliasConfig = this.aliasConfig
    return json
  }
}

var mixinConfigOverride = prototype => {
  prototype.configOverride = function(config) {
    return this.addMiddleware(
      new ConfigOverrideMiddleware(config))
  }
}

var mixinConfigAlias = prototype => {
  prototype.configAlias = function(config) {
    return this.addMiddleware(
      new ConfigAliasMiddleware(config))
  }
}

mixinConfigOverride(ExtensibleHandler.prototype)
mixinConfigOverride(ExtensibleMiddleware.prototype)

mixinConfigAlias(ExtensibleHandler.prototype)
mixinConfigAlias(ExtensibleMiddleware.prototype)

export var configMiddleware = (handler) =>
  new ConfigMiddleware(handler)

export var configOverrideMiddleware = (config) =>
  new ConfigOverrideMiddleware(config)

export var configAliasMiddleware = (config) =>
  new ConfigAliasMiddleware(config)