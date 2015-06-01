import { copy, ownKeys } from 'quiver-object'
import { resolve } from 'quiver-promise'

import { safeHandler } from './util/wrap'
import { HandleableMiddleware } from './handleable-middleware'
import { ExtensibleComponent } from './extensible-component'

const _aliasConfig = Symbol('_aliasConfig')
const _configHandler = Symbol('_configHandler')
const _overrideConfig = Symbol('_overrideConfig')

const configHandlerToMiddleware = configHandler =>
  (config, builder) =>
    configHandler(config)
    .then((newConfig=config) =>
      builder(newConfig))

export class ConfigMiddleware extends HandleableMiddleware {
  constructor(configHandler, options={}) {
    super(null, options)
    this[_configHandler] = configHandler
  }

  toMainHandleableMiddleware() {
    const configHandler = this.toConfigHandler()

    return configHandlerToMiddleware(configHandler)
  }

  toConfigHandler() {
    return safeHandler(this[_configHandler])
  }

  get componentType() {
    return 'ConfigMiddleware'
  }
}

export class ConfigOverrideMiddleware extends ConfigMiddleware {
  constructor(overrideConfig, options={}) {
    super(null, options)
    this[_overrideConfig] = overrideConfig
  }

  toConfigHandler() {
    const overrideConfig = this[_overrideConfig]

    return config => {
      for(let key of ownKeys(overrideConfig)) {
        config[key] = overrideConfig[key]
      }

      return resolve(config)
    }
  }

  get overrideConfig() {
    return this[_overrideConfig]
  }

  get componentType() {
    return 'ConfigOverrideMiddleware'
  }
}

export class ConfigAliasMiddleware extends ConfigMiddleware {
  constructor(aliasConfig, options={}) {
    super(null, options)
    this[_aliasConfig] = aliasConfig
  }

  toConfigHandler() {
    const aliasConfig = this[_aliasConfig]

    return config => {
      for(let key of ownKeys(aliasConfig)) {
        const aliasKey = aliasConfig[key]
        config[key] = config[aliasKey]
      }

      return resolve(config)
    }
  }

  get aliasConfig() {
    return this[_aliasConfig]
  }

  get componentType() {
    return 'ConfigAliasMiddleware'
  }
}

export const configOverride = function(config) {
  return this.addMiddleware(
    new ConfigOverrideMiddleware(config))
}

export const configAlias = function(config) {
  return this.addMiddleware(
    new ConfigAliasMiddleware(config))
}

export const configMiddleware = (handler) =>
  new ConfigMiddleware(handler)

export const configOverrideMiddleware = (config) =>
  new ConfigOverrideMiddleware(config)

export const configAliasMiddleware = (config) =>
  new ConfigAliasMiddleware(config)
