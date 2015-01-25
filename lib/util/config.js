import { copy, noCopy } from 'quiver-object'

let configNormalized = Symbol('ConfigNormalized')
let handlerMap = Symbol('handlerMap')
let bundleMap = Symbol('bundleMap')
let initTable = Symbol('initTable')

export let globalConfig = config => {
  if(!config.global) {
    config.global = noCopy({})
  }

  return config.global
}

export let normalizeConfig = config => {
  let global = globalConfig(config)

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

export let getHandlerMap = config => {
  normalizeConfig(config)

  return config.global[handlerMap]
}

export let getBundleMap = config => {
  normalizeConfig(config)

  return config.global[bundleMap]
}

export let getInitTable = config => {
  normalizeConfig(config)

  return config.global[initTable]
}

export let getHandleable = (config, component) => {
  let handlerMap = getHandlerMap(config)
  return handlerMap[component.id]
}

export let getBundle = (config, component) => {
  let bundleMap = getBundleMap(config)
  return bundleMap[component.id]
}