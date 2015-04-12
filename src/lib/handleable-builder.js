import { resolve } from 'quiver-promise'

import { safeHandler } from './util/wrap'
import { ExtensibleHandler } from './extensible-component'

const _handleable = Symbol('_handleable')
const _handleableBuilder = Symbol('_handleableBuilder')

export class HandleableBuilder extends ExtensibleHandler {
  constructor(handleableBuilder, options={}) {
    super(options)

    this[_handleableBuilder] = handleableBuilder
  }

  toMainHandleableBuilder() {
    return safeHandler(this[_handleableBuilder])
  }

  get componentType() {
    return 'HandleableBuilder'
  }
}

export class Handleable extends HandleableBuilder {
  constructor(handleable, options={}) {
    super(null, options)
    
    this[_handleable] = handleable
  }

  toMainHandleableBuilder() {
    const handleable = this.toHandleable()

    return config => resolve(handleable)
  }

  toHandleable() {
    if(!this[_handleable]) throw new Error(
      'handleable is not defined')

    return this[_handleable]
  }

  get componentType() {
    return 'Handleable'
  }
}

export const handleableBuilder = (builder, options) =>
  new HandleableBuilder(builder, options)

export const handleable = (handleable, options) =>
  new Handleable(handleable, options)