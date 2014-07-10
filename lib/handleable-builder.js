import { resolve } from 'quiver-promise'
import { assertInstanceOf } from 'quiver-object'

import { safeHandler } from './util/wrap.js'
import { ExtensibleHandler } from './extensible-component.js'

import { privatizedConstructor } from './privatize.js'

export class HandleableBuilder extends ExtensibleHandler {
  constructor(handleableBuilder, options={}) {
    this._rawHandleableBuilder = handleableBuilder
    
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
    var builder = config => resolve(handleable)

    options.safeWrapped = true
    super(builder, options)
  }

  get type() {
    return 'handleable'
  }
}

export var handleableBuilder = (builder, options) =>
  new HandleableBuilder(builder, options)

export var handleable = (handleable, options) =>
  new Handleable(handleable, options)