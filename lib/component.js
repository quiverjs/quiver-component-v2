import { loadHandleable } from './util/loader'

let assertComponent = component => {
  if(!component.isQuiverComponent) {
    throw new Error('object must be of type Component')
  }
}

export class Component {
  constructor(options={}) {
    let { 
      name,
      subComponents = { }
    } = options

    this._name = name
    this._id = Symbol()
    this._options = options

    for(let key in subComponents) {
      let component = subComponents[key]
      assertComponent(component)
    }

    this._subComponents = subComponents
  }

  get name() {
    return this._name
  }

  get id() {
    return this._id
  }

  get type() {
    return 'component'
  }

  get isQuiverComponent() {
    return true
  }

  get subComponents() {
    return this._subComponents
  }

  clone() {
    let newInstance = Object.create(this)

    let privateId = Symbol()
    Object.defineProperty(newInstance, 'id', {
      get() {
        return privateId
      }
    })

    return newInstance
  }

  map(mapper, mapTable={}) {
    let currentId = this.id

    if(mapTable[currentId]) {
      return mapTable[currentId]
    }

    let copy = this.clone()
    mapTable[currentId] = copy

    this.doMap(copy, mapper, mapTable)

    return copy
  }

  each(iteratee) {
    let { subComponents } = this

    for(let key in subComponents) {
      iteratee(subComponents[key])
    }
  }

  doMap(target, mapper, mapTable) {
    let { subComponents } = this
    let newSubComponents = { }

    for(let key in subComponents) {
      let component = subComponents[key]

      newSubComponents[key] = mapper(component, mapTable)
    }

    target._subComponents = newSubComponents
  }

  factory() {
    return (forkTable={}) =>
      this.fork(forkTable)
  }

  fork(forkTable={}) {
    return this.map(
      (component, mapTable) =>
        component.fork(mapTable),
      forkTable)
  }

  implement(componentMap) {
    this.each(component => 
      component.implement(componentMap))

    return this
  }

  toJson() {
    let json = { 
      id: this.id.toString(),
      type: this.type
    }

    if(this.name) {
      json.name = this.name
    }
    
    return json
  }

  toString() {
    return JSON.stringify(this.toJson(), undefined, 2)
  }

  inspect() {
    return this.toString()
  }
}