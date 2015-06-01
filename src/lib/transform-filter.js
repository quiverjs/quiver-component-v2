import { copy } from 'quiver-object'
import { resolve } from 'quiver-promise'

import { StreamFilter } from './filter'
import { HandlerComponent } from './component'
import { loadStreamHandler } from './util/loader'

const _transformMode = Symbol('_transformMode')

const validModes = {
  'in': true,
  'out': true,
  'inout': true
}

const echoHandler = (args, streamable) =>
  resolve(streamable)

const wrapHandler = handler =>
  (args, ...restArgs) =>
    handler(copy(args), ...restArgs)

const inTransformHandler = (handler, mode) =>
  mode != 'out' ? wrapHandler(handler): echoHandler

const wrapMainHandler = (handler, mode) =>
  mode == 'in' ? handler : wrapHandler(handler)

const outTransformHandler = (handler, mode) =>
  mode != 'in' ? handler : echoHandler

export class TransformFilter extends StreamFilter {
  constructor(handlerComponent, transformMode, options={}) {
    if(!handlerComponent.isHandlerComponent)
      throw new TypeError('input handler component must be of type HandlerComponent')

    if(!validModes[transformMode])
      throw new TypeError('invalid transform mode provided in options')

    super(null, options)

    this[_transformMode] = transformMode
    this.subComponents.transformComponent = handlerComponent
  }

  toStreamFilter() {
    const transformComponent = this.transformComponent

    const componentId = transformComponent.id
    const builder = transformComponent.toHandleableBuilder()

    const transformMode = this[_transformMode]

    return async function(config, handler) {
      const transformHandler = await loadStreamHandler(config, componentId, builder)

      const transformIn = inTransformHandler(
        transformHandler, transformMode)

      const mainHandler = wrapMainHandler(
        handler, transformMode)

      const transformOut = outTransformHandler(
        transformHandler, transformMode)

      return async function(args, streamable) {
        const transformedIn = await transformIn(args, streamable)
        const resultStreamable = await mainHandler(args, transformedIn)
        return transformOut(args, resultStreamable)
      }
    }
  }

  get transformComponent() {
    return this.subComponents.transformComponent
  }

  get transformMode() {
    return this[_transformMode]
  }

  get componentType() {
    return 'TransformFilter'
  }
}

export const transformFilter = (handler, mode, options) => 
  new TransformFilter(handler, mode, options)
