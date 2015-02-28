import { resolve } from 'quiver-promise'
import { copy } from 'quiver-object'

import { StreamFilter } from './filter'
import { HandlerComponent } from './component'
import { loadStreamHandler } from './util/loader'

let validModes = {
  'in': true,
  'out': true,
  'inout': true
}

let echoHandler = (args, streamable) =>
  resolve(streamable)

let wrapHandler = handler =>
  (args, ...restArgs) =>
    handler(copy(args), ...restArgs)

let inTransformHandler = (handler, mode) =>
  mode != 'out' ? wrapHandler(handler): echoHandler

let wrapMainHandler = (handler, mode) =>
  mode == 'in' ? handler : wrapHandler(handler)

let outTransformHandler = (handler, mode) =>
  mode != 'in' ? handler : echoHandler

export class TransformFilter extends StreamFilter {
  constructor(handlerComponent, transformMode, options={}) {
    if(!handlerComponent.isHandlerComponent)
      throw new TypeError('input handler component must be of type HandlerComponent')

    if(!validModes[transformMode])
      throw new TypeError('invalid transform mode provided in options')

    this._transformMode = transformMode

    options.safeWrapped = true

    super(null, options)

    this.subComponents.transformComponent = handlerComponent
  }

  toStreamFilter() {
    let transformComponent = this.transformComponent

    let componentId = transformComponent.id
    let builder = transformComponent.toHandleableBuilder()

    let transformMode = this.transformMode

    return (config, handler) => 
      loadStreamHandler(config, componentId, builder)
      .then(transformHandler => {
        let transformIn = inTransformHandler(
          transformHandler, transformMode)

        let mainHandler = wrapMainHandler(
          handler, transformMode)

        let transformOut = outTransformHandler(
          transformHandler, transformMode)

        return (args, streamable) => 
          transformIn(args, streamable)
          .then(transformedIn =>
            mainHandler(args, transformedIn)
            .then(resultStreamable =>
              transformOut(args, resultStreamable)))
      })
  }

  get transformComponent() {
    return this.subComponents.transformComponent
  }

  get transformMode() {
    return this._transformMode
  }

  get type() {
    return 'transform filter'
  }

  toJson() {
    let json = super.toJson()

    json.transformMode = this.transformMode
    json.transformHandler = this.transformComponent.toJson()

    return json
  }
}

export let transformFilter = (handler, mode, options) => 
  new TransformFilter(handler, mode, options)