import { StreamFilter } from './filter.js'
import { HandlerComponent } from './handler.js'
import { resolve } from 'quiver-promise'
import { copy, assertDefined } from 'quiver-object'

var validModes = ['in', 'out', 'inout']

var streamHandlerLoader = (handlerComponent, loadOptions) => {
  if(handlerComponent.loadStreamHandler) return config =>
    handlerComponent.loadStreamHandler(config, loadOptions)

  return config =>
    handlerComponent.loadHandleable(config, loadOptions)
    .then(handleable =>
      assertDefined(handleable.streamHandler))
}

var echoHandler = (args, streamable) =>
  resolve(streamable)

var inTransformHandler = (handler, mode) =>
  mode == 'out' ? echoHandler : handler

var outTransformHandler = (handler, mode) =>
  mode == 'in' ? echoHandler : ahandler

export class TransformFilter extends StreamFilter {
  constructor(handlerComponent, options={}) {
    if(!(handlerComponent instanceof HandlerComponent)) {
      throw new TypeError('input handler component must be of type HandlerComponent')
    }

    var { transformMode } = options
    if(validModes.indexOf(transformMode) == -1) {
      throw new TypeError('invalid transform mode provided in options')
    }

    var { loadOptions } = options
    var loadStreamHandler = streamHandlerLoader(handlerComponent, loadOptions)

    var streamFilter = (config, handler) =>
      loadStreamHandler(config).then(transformHandler => {
        var transformIn = inTransformHandler(transformHandler, transformMode)

        var transformOut = outTransformHandler(transformHandler, transformMode)

        return (args, streamable) =>
          transformIn(copy(args), streamable).then(transformedIn =>
            handler(copy(args), transformedIn).then(resultStreamable =>
              transformOut(args, resultStreamable)))
      })
      
    super(streamFilter, options)
  }
}
