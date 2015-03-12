import { Component } from '../component'

let _componentMap = Symbol('@componentMap')

export class MapComponent extends Component {
  constructor(componentMap=new Map(), options={}) {
    super(options)
    this[_componentMap] = componentMap
  }

  each(iteratee) {
    for(let component of this[_componentMap].values()) {
      iteratee(component)
    }

    super.each(iteratee)
  }

  doMap(target, mapper, mapTable) {
    let targetMap = new Map()

    for(let [key, component] of this[_componentMap].entries()) {
      targetMap[key] = component.applyMap(mapper, mapTable)
    }

    allKeys(componentMap).forEach(key => {
      let component = componentMap[key]
      targetMap[key] = component.applyMap(mapper, mapTable)
    })

    target[_componentMap] = targetMap
    super.doMap(target, mapper, mapTable)
  }

  set(key, component) {
    if(!component.isQuiverComponent) {
      throw new TypeError('object must be a quiver component')
    }

    this[_componentMap].set(key, component)
  }

  get(key) {
    return this[_componentMap].get(key)
  }

  get map() {
    return this[_componentMap]
  }
}

export let mapComponent = (components=new Map()) =>
  new MapComponent(components)