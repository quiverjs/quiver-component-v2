import { copy, noCopy } from 'quiver-object'

var configNormalized = Symbol('ConfigNormalized')
var handlerMap = Symbol('handlerMap')
var initTable = Symbol('initTable')

export var normalizeConfig = config => {
  if(config[configNormalized]) return

  if(!config[handlerMap]) {
    config[handlerMap] = noCopy({})
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

export var getHandleable = (config, component) => {
  var handlerMap = getHandlerMap(config)
  return handlerMap[component.id]
}