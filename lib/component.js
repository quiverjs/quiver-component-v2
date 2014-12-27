import { loadHandleable } from './util/loader'

var assertComponent = component => {
  if(!component.isQuiverComponent) {
    throw new Error('object must be of type Component')
  }
}

export class Component {
  constructor(options={}) {
    var { 
      name,
      subComponents = { }
    } = options

    this._name = name
    this._id = Symbol()
    this._options = options

    for(var key in subComponents) {
      var component = subComponents[key]
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
    var originalProto = this.originalProto ? 
      this.originalProto : this

    var newInstance = Object.create(originalProto)
    newInstance.originalProto = originalProto

    var privateId = Symbol()
    Object.defineProperty(newInstance, 'id', {
      get() {
        return privateId
      }
    })

    return newInstance
  }

  map(mapper) {
    var copy = this.clone()
    this.doMap(copy, mapper)
    return copy
  }

  each(iteratee) {
    var { subComponents } = this

    for(var key in subComponents) {
      iteratee(subComponents[key])
    }
  }

  doMap(target, mapper) {
    var { subComponents } = this
    var newSubComponents = { }

    for(var key in subComponents) {
      var component = subComponents[key]

      newSubComponents[key] = mapper(component)
    }

    target._subComponents = newSubComponents
  }

  factory() {
    return (forkTable={}) =>
      this.fork(forkTable)
  }

  fork(forkTable={}) {
    var originalId = this.id

    if(forkTable[originalId]) {
      return forkTable[originalId]
    }

    var forkedInstance = this.clone()
    forkTable[originalId] = forkedInstance

    this.doMap(forkedInstance,
      component => component.fork(forkTable))

    return forkedInstance
  }

  implement(componentMap) {
    this.each(component => 
      component.implement(componentMap))

    return this
  }

  toJson() {
    var json = { 
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