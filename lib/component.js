import { loadHandleable } from './util/loader.js'

export class Component {
  constructor(options={}) {
    var { name='' } = options
    this._name = name
  }

  get name() {
    return this._name
  }
}

export class MiddlewareComponent extends Component {
  get handleableMiddleware() {
    throw new Error('unimplemented in abstract class')
  }
}

export class HandlerComponent extends Component {
  get handleableBuilder() {
    throw new Error('unimplemented in abstract class')
  }

  loadHandleable(config, options) {
    return loadHandleable(config, this, options)
  }

  loadHandler(config, options) {
    return loadHandleable(config, this, options)
  }
}
