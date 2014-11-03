import { copy, defineGetter,
  assertInstanceOf, assertArrayInstanceOf 
} from 'quiver-object'

import { HandlerComponent } from './component'
import { ExtensibleHandler } from './extensible-component'

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
      builder => builder(config)))
    .then(handleables => 
      pipelineHandleables(handleables, combinators))

export class Pipeline extends ExtensibleHandler {
  constructor(options={}) {
    var { pipelineCombinators=defaultCombinators } = options

    this._pipelineCombinators = pipelineCombinators

    super(options)
    
    this.subComponents.pipelineHandlers = []
  }

  addPipe(component) {
    assertInstanceOf(component, HandlerComponent,
      'component must be of type HandlerComponent')

    this.subComponents.pipelineHandlers.push(component)
    return this
  }

  get pipelineHandlers() {
    return this.subComponents.pipelineHandlers
  }

  get mainHandleableBuilder() {
    var builders = this.pipelineHandlers.map(
      component => component.handleableBuilder)

    if(builders.length == 0) throw new Error(
      'Pipeline must contain at least one handler component')

    var combinators = this._pipelineCombinators

    return pipelineBuilder(builders, combinators)
  }

  get type() {
    return 'pipeline'
  }

  toJson() {
    var json = super.toJson()
    json.pipelines = this.pipelineHandlers.map(
      component => component.toJson())

    return json
  }
}

export var pipeline = options =>
  new Pipeline(options)