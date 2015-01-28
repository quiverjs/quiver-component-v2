import { Component } from './component'

export class ComponentList extends Component {
  constructor(componentList, options) {
    this._componentArray = componentList
    super(options)
  }

  each(iteratee) {
    this._componentArray.forEach(iteratee)
    super.each(iteratee)
  }

  doMap(target, mapper, mapTable) {
    target._componentArray = this._componentArray.map(
      component =>
        component.applyMap(mapper, mapTable))

    super.doMap(mapper, mapTable)
  }

  push(component) {
    if(!component.isQuiverComponent) {
      throw new TypeError('object must be a quiver component')
    }

    this._componentArray.push(component)
  }

  get array() {
    return this._componentArray
  }
}

export let componentList = (components=[]) =>
  new ComponentList(components)