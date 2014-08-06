import { loadHandleable } from './util/loader.js'

export class Component {
  constructor(options={}) {
    var { name } = options

    this._name = name
    this._id = Symbol()
    this._options = options
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

  makePrivate(privateTable={}) {
    var original = this
    var originalId = original.id

    if(privateTable[originalId]) return privateTable[originalId]

    var privateId = Symbol()

    var originalProto = original.originalProto ? 
      original.originalProto : original

    var privateInstance = Object.create(originalProto)
    privateInstance.originalProto = originalProto

    Object.defineProperty(privateInstance, 'id', {
      get() {
        return privateId
      }
    })
    
    privateTable[originalId] = privateInstance

    original.privatize(privateInstance, privateTable)

    return privateInstance
  }

  privatize(privateInstance, privateTable) {
    // noop
  }

  privatizedConstructor() {
    return privateTable =>
      this.makePrivate(privateTable)
  }

  toJson() {
    var json = { 
      id: this.id.toString(),
      type: this.type
    }

    if(this.name) 
      json.name = this.name
    
    return json
  }

  toString() {
    return JSON.stringify(this.toJson(), undefined, 2)
  }

  inspect() {
    return this.toString()
  }
}

export class MiddlewareComponent extends Component {
  get handleableMiddleware() {
    throw new Error('unimplemented in abstract class')
  }

  addMiddleware(MiddlewareComponent) {
    throw new Error('unimplemented in abstract class')
  }

  get type() {
    return 'middleware'
  }
}

export class HandlerComponent extends Component {
  get handleableBuilder() {
    throw new Error('unimplemented in abstract class')
  }

  addMiddleware(MiddlewareComponent) {
    throw new Error('unimplemented in abstract class')
  }

  loadHandleable(config, options) {
    return loadHandleable(config, this, options)
  }

  loadHandler(config, options) {
    return this.handlerLoader(config, this, options)
  }

  get handlerLoader() {
    return loadHandleable
  }

  get type() {
    return 'handler'
  }
}
