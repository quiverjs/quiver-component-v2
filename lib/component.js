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

  fork(forkTable={}) {
    var original = this
    var originalId = original.id

    if(forkTable[originalId]) {
      return forkTable[originalId]
    }

    var privateId = Symbol()

    var originalProto = original.originalProto ? 
      original.originalProto : original

    var forkedInstance = Object.create(originalProto)
    forkedInstance.originalProto = originalProto

    Object.defineProperty(forkedInstance, 'id', {
      get() {
        return privateId
      }
    })
    
    forkTable[originalId] = forkedInstance

    original.doFork(forkedInstance, forkTable)

    return forkedInstance
  }

  doFork(forkedInstance, forkTable) {
    var { subComponents } = this
    var newSubComponents = { }

    for(var key in subComponents) {
      var component = subComponents[key]

      newSubComponents[key] = component.fork(forkTable)
    }

    forkedInstance._subComponents = newSubComponents
  }

  toTemplate() {
    return () =>
      this.fork({})
  }

  implement(componentMap) {
    var { subComponents } = this

    for(var key in subComponents) {
      subComponents[key].implement(componentMap)
    }
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