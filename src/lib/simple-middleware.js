import { copy } from 'quiver-object'
import { resolve } from 'quiver-promise'

import { safeHandler } from './util/wrap'
import { HandleableMiddleware } from './handleable-middleware'
import { ExtensibleComponent } from './extensible-component'

let configHandlerToMiddleware = configHandler =>
  (config, builder) =>
    configHandler(config)
    .then((newConfig=config) =>
      builder(newConfig))

export class ConfigMiddleware extends HandleableMiddleware {
  constructor(configHandler, options={}) {
    configHandler = safeHandler(configHandler, options)

    super(null, options)
    this._configHandler = configHandler
  }

  toMainHandleableMiddleware() {
    let configHandler = this.toConfigHandler()

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
    options.safeWrapped = true

    super(null, options)
    this._overrideConfig = overrideConfig
  }

  toConfigHandler() {
    let overrideConfig = this.overrideConfig

    return config => {
      for(let key in overrideConfig) {
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
    let json = super.toJson()

    json.overrideConfig = this.overrideConfig
    return json
  }
}

export class ConfigAliasMiddleware extends ConfigMiddleware {
  constructor(aliasConfig, options={}) {
    options.safeWrapped = true

    super(null, options)
    this._aliasConfig = aliasConfig
  }

  toConfigHandler() {
    let aliasConfig = this._aliasConfig

    return config => {
      for(let key in aliasConfig) {
        let aliasKey = aliasConfig[key]
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
    let json = super.toJson()

    json.aliasConfig = this.aliasConfig
    return json
  }
}

let mixinConfigOverride = prototype => {
  prototype.configOverride = function(config) {
    return this.addMiddleware(
      new ConfigOverrideMiddleware(config))
  }
}

let mixinConfigAlias = prototype => {
  prototype.configAlias = function(config) {
    return this.addMiddleware(
      new ConfigAliasMiddleware(config))
  }
}

mixinConfigOverride(ExtensibleComponent.prototype)
mixinConfigAlias(ExtensibleComponent.prototype)

export let configMiddleware = (handler) =>
  new ConfigMiddleware(handler)

export let configOverrideMiddleware = (config) =>
  new ConfigOverrideMiddleware(config)

export let configAliasMiddleware = (config) =>
  new ConfigAliasMiddleware(config)