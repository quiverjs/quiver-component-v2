import { copy } from 'quiver-object'

var configNormalizedKey = 'quiverConfigNormalized'
var handlerMapKey = 'quiverHandleables'

export var normalizeConfig = config => {
  if(config[configNormalizedKey]) return

  if(!config[handlerMapKey]) {
    config[handlerMapKey] = new Map()
  }

  config[configNormalizedKey] = true
}

export var getHandlerMap = config => {
  normalizeConfig(config)

  return config[handlerMapKey]
}

export var getHandleable = (config, key) => {
  var handlerMap = getHandlerMap(config)
  return handlerMap.get(key)
}