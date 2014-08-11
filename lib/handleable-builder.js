import { resolve } from 'quiver-promise'
import { assertInstanceOf } from 'quiver-object'

import { safeHandler } from './util/wrap.js'
import { ExtensibleHandler } from './extensible-component.js'

export class HandleableBuilder extends ExtensibleHandler {
  constructor(handleableBuilder, options={}) {
    this._mainHandleableBuilder = safeHandler(
      handleableBuilder, options)

    super(options)
  }

  get mainHandleableBuilder() {
    return this._mainHandleableBuilder
  }

  get type() {
    return 'handleable builder'
  }
}

export class Handleable extends HandleableBuilder {
  constructor(handleable, options={}) {
    this._handleable = handleable
    options.safeWrapped = true

    super(null, options)
  }

  get mainHandleableBuilder() {
    var handleable = this.handleable

    return config => resolve(handleable)
  }

  get handleable() {
    if(!this._handleable) throw new Error(
      'handleable is not defined')

    return this._handleable
  }

  get type() {
    return 'handleable'
  }
}

export var handleableBuilder = (builder, options) =>
  new HandleableBuilder(builder, options)

export var handleable = (handleable, options) =>
  new Handleable(handleable, options)