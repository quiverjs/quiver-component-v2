import { Component } from '../component'

const _componentArray = Symbol('@componentArray')

export class ListComponent extends Component {
  constructor(componentList=[], options={}) {
    super(options)
    this[_componentArray] = componentList
  }

  *ownSubComponents() {
    for(let subComponent of this[_componentArray]) {
      yield subComponent
    }

    yield* super.ownSubComponents()
  }

  doMap(target, mapper, mapTable) {
    target[_componentArray] = this[_componentArray].map(
      component =>
        component.applyMap(mapper, mapTable))

    super.doMap(target, mapper, mapTable)
  }

  push(component) {
    if(!component.isQuiverComponent) {
      throw new TypeError('object must be a quiver component')
    }

    this[_componentArray].push(component)
  }

  unshift(component) {
    if(!component.isQuiverComponent) {
      throw new TypeError('object must be a quiver component')
    }

    this[_componentArray].unshift(component)
  }

  get array() {
    return this[_componentArray]
  }

  get componentType() {
    return 'ListComponent'
  }
}

export const listComponent = (components=[]) =>
  new ListComponent(components)
