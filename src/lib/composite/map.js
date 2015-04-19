import { Component } from '../component'

const _componentMap = Symbol('@componentMap')

export class MapComponent extends Component {
  constructor(componentMap=new Map(), options={}) {
    super(options)
    this[_componentMap] = componentMap
  }

  *ownSubComponents() {
    for(let subComponent of this[_componentMap].values()) {
      yield subComponent
    }

    yield* super.ownSubComponents()
  }

  doMap(target, mapper, mapTable) {
    const targetMap = new Map()

    for(let [key, component] of this[_componentMap].entries()) {
      targetMap[key] = component.applyMap(mapper, mapTable)
    }

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

  get componentType() {
    return 'MapComponent'
  }
}

export const mapComponent = (components=new Map()) =>
  new MapComponent(components)
