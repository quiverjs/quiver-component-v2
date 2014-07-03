import { resolve } from 'quiver-promise'
import { copy } from 'quiver-object'

import { StreamFilter } from './filter.js'
import { HandlerComponent } from './component.js'
import { loadStreamHandler } from './util/loader.js'

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
  constructor(handlerComponent, options={}) {
    if(!(handlerComponent instanceof HandlerComponent))
      throw new TypeError('input handler component must be of type HandlerComponent')

    this._transformComponent = handlerComponent

    var { transformMode } = options
    if(!validModes[transformMode])
      throw new TypeError('invalid transform mode provided in options')

    var { loadOptions } = options

    var streamFilter = (config, handler) => 
      loadStreamHandler(config, handlerComponent)
        .then(transformHandler => {
          var transformIn = inTransformHandler(transformHandler, transformMode)
          var mainHandler = wrapMainHandler(handler, transformMode)
          var transformOut = outTransformHandler(transformHandler, transformMode)

          return (args, streamable) => 
            transformIn(args, streamable).then(transformedIn =>
              mainHandler(args, transformedIn).then(resultStreamable =>
                transformOut(args, resultStreamable)))
        })

    options.safeWrapped = true
      
    super(streamFilter, options)
  }

  get transformComponent() {
    return this._transformComponent
  }
}