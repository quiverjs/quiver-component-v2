import { copy, noCopy } from 'quiver-object'

var configNormalized = Symbol('ConfigNormalized')
var handlerMap = Symbol('handlerMap')
var bundleMap = Symbol('bundleMap')
var initTable = Symbol('initTable')

export var normalizeConfig = config => {
  if(config[configNormalized]) return

  if(!config[handlerMap]) {
    config[handlerMap] = noCopy({})
  }

  if(!config[bundleMap]) {
    config[bundleMap] = noCopy({})
  }

  if(!config[initTable]) {
    config[initTable] = { }
  }

  config[configNormalized] = true
}

export var getHandlerMap = config => {
  normalizeConfig(config)

  return config[handlerMap]
}

export var getBundleMap = config => {
  normalizeConfig(config)

  return config[bundleMap]
}

export var getInitTable = config => {
  normalizeConfig(config)

  return config[initTable]
}

export var getHandleable = (config, component) => {
  var handlerMap = getHandlerMap(config)
  return handlerMap[component.id]
}

export var getBundle = (config, component) => {
  var bundleMap = getBundleMap(config)
  return bundleMap[component.id]
}