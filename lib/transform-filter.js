import { resolve } from 'quiver-promise'
import { copy } from 'quiver-object'

import { StreamFilter } from './filter'
import { HandlerComponent } from './component'
import { loadStreamHandler } from './util/loader'

var validModes = {
  'in': true,
  'out': true,
  'inout': true
}

var echoHandler = (args, streamable) =>
  resolve(streamable)

var wrapHandler = handler =>
  (args, ...restArgs) =>
    handler(copy(args), ...restArgs)

var inTransformHandler = (handler, mode) =>
  mode != 'out' ? wrapHandler(handler): echoHandler

var wrapMainHandler = (handler, mode) =>
  mode == 'in' ? handler : wrapHandler(handler)

var outTransformHandler = (handler, mode) =>
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
    var transformComponent = this.transformComponent
    var transformMode = this.transformMode

    return (config, handler) => 
      loadStreamHandler(config, transformComponent)
      .then(transformHandler => {
        var transformIn = inTransformHandler(
          transformHandler, transformMode)

        var mainHandler = wrapMainHandler(
          handler, transformMode)

        var transformOut = outTransformHandler(
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
    var json = super.toJson()

    json.transformMode = this.transformMode
    json.transformHandler = this.transformComponent.toJson()

    return json
  }
}

export var transformFilter = (handler, mode, options) => 
  new TransformFilter(handler, mode, options)