import { copy, defineGetter,
  assertInstanceOf, assertArrayInstanceOf 
} from 'quiver-object'

import { HandlerComponent } from './component.js'

var combineStreamHandlers = (handler1, handler2) => 
  (args, streamable) =>
    handler1(copy(args), streamable).then(streamable =>
      handler2(args, streamable))

var streamCombinator = {
  field: 'streamHandler',
  combineHandlers: combineStreamHandlers
}

var defaultCombinators = [streamCombinator]

var combineHandleables = (handleable1, handleable2, combinators) => {
  var newHandleable = { }

  combinators.forEach(({ field, combineHandlers }) => {
    var handler1 = handleable1[field]
    var handler2 = handleable2[field]

    if(!handler1 || !handler2) return

    var newHandler = combineHandlers(handler1, handler2)
    defineGetter(newHandleable, field, newHandler) 
  })

  return newHandleable
}

var pipelineHandleables = (handleables, combinators) => {
  if(handleables.length == 1) return handleables[0]

  var [handleable1, handleable2, ...restHandleables] = handleables
  var newHandleable = combineHandleables(handleable1, handleable2, combinators)

  return pipelineHandleables([newHandleable, ...restHandleables], combinators)
}

var pipelineBuilder = (builders, combinators) =>
  config =>
    Promise.all(builders.map(
      builder => builder(copy(config))))
    .then(handleables => 
      pipelineHandleables(handleables, combinators))

export class Pipeline extends HandlerComponent {
  constructor(handlerComponents=[], options={}) {
    assertArrayInstanceOf(handlerComponents, HandlerComponent,
      'component must be of type HandlerComponent')

    var { pipelineCombinators=defaultCombinators } = options

    this._pipelineHandlers = handlerComponents
    this._pipelineCombinators = pipelineCombinators

    super(options)
  }

  addPipe(component) {
    assertInstanceOf(component, HandlerComponent,
      'component must be of type HandlerComponent')

    this._pipelineHandlers.push(component)
  }

  get handleableBuilder() {
    var builders = this._pipelineHandlers.map(
      component => component.handleableBuilder)

    var combinators = this._pipelineCombinators

    if(builders.length == 0) throw new Error(
      'Pipeline must contain at least one handler component')

    return pipelineBuilder(builders, combinators)
  }
}