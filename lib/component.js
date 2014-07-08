import { loadHandleable } from './util/loader.js'

export class Component {
  constructor(options={}) {
    var { name } = options

    this._name = name
  }

  get name() {
    return this._name
  }

  get type() {
    return 'component'
  }

  toJson() {
    var json = { 
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
