import { copy, noCopy } from 'quiver-object'

var configNormalized = Symbol('ConfigNormalized')
var handlerMap = Symbol('handlerMap')
var bundleMap = Symbol('bundleMap')
var initTable = Symbol('initTable')

export var globalConfig = config => {
  if(!config.global) {
    config.global = noCopy({})
  }

  return config.global
}

export var normalizeConfig = config => {
  var global = globalConfig(config)

  if(global[configNormalized]) return

  if(!global[handlerMap]) {
    global[handlerMap] = noCopy({})
  }

  if(!global[bundleMap]) {
    global[bundleMap] = noCopy({})
  }

  if(!global[initTable]) {
    global[initTable] = { }
  }

  global[configNormalized] = true

  return config
}

export var getHandlerMap = config => {
  normalizeConfig(config)

  return config.global[handlerMap]
}

export var getBundleMap = config => {
  normalizeConfig(config)

  return config.global[bundleMap]
}

export var getInitTable = config => {
  normalizeConfig(config)

  return config.global[initTable]
}

export var getHandleable = (config, component) => {
  var handlerMap = getHandlerMap(config)
  return handlerMap[component.id]
}

export var getBundle = (config, component) => {
  var bundleMap = getBundleMap(config)
  return bundleMap[component.id]
}