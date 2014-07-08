import { copy } from 'quiver-object'

var configNormalized = Symbol('ConfigNormalized')
var handlerMap = Symbol('handlerMap')
var initTable = Symbol('initTable')

export var normalizeConfig = config => {
  if(config[configNormalized]) return

  if(!config[handlerMap]) {
    config[handlerMap] = new Map()
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

export var getInitTable = config => {
  normalizeConfig(config)

  return config[initTable]
}

export var getHandleable = (config, key) => {
  var handlerMap = getHandlerMap(config)
  return handlerMap.get(key)
}