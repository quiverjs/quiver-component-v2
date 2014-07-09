import { resolve } from 'quiver-promise'
import { assertInstanceOf } from 'quiver-object'

import { safeHandler } from './util/wrap.js'
import { ExtensibleHandler } from './extensible-component.js'

export class HandleableBuilder extends ExtensibleHandler {
  constructor(handleableBuilder, options={}) {
    this._mainHandleableBuilder = handleableBuilder
    this._handleableBuilder = safeHandler(handleableBuilder, options)

    super(options)
  }

  get mainHandleableBuilder() {
    return this._mainHandleableBuilder
  }

  get type() {
    return 'handleable builder'
  }

  toJson() {
    var json = super.toJson()
    json.middlewares = this.middlewareJson()
    return json
  }
}

export class Handleable extends HandleableBuilder {
  constructor(handleable, options={}) {
    var builder = config => resolve(handleable)

    options.safeWrapped = true
    super(builder, options)
  }

  get type() {
    return 'handleable'
  }
}