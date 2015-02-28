import { Component } from '../component'

let _componentArray = Symbol('@componentArray')

export class ListComponent extends Component {
  constructor(componentList=[], options={}) {
    this[_componentArray] = componentList
    super(options)
  }

  each(iteratee) {
    this[_componentArray].forEach(iteratee)
    super.each(iteratee)
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
}

export let listComponent = (components=[]) =>
  new ListComponent(components)