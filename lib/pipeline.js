import { copy } from 'quiver-object'
import { ExtensibleHandler } from './extensible-component'

let combineStreamHandlers = (handler1, handler2) => 
  (args, streamable) =>
    handler1(copy(args), streamable).then(streamable =>
      handler2(args, streamable))

let streamCombinator = {
  field: 'streamHandler',
  combineHandlers: combineStreamHandlers
}

let defaultCombinators = [streamCombinator]

let combineHandleables = (handleable1, handleable2, combinators) => {
  let newHandleable = { }

  combinators.forEach(({ field, combineHandlers }) => {
    let handler1 = handleable1[field]
    let handler2 = handleable2[field]

    if(!handler1 || !handler2) return

    let newHandler = combineHandlers(handler1, handler2)
    newHandleable[field] = newHandler
  })

  return newHandleable
}

let pipelineHandleables = (handleables, combinators) => {
  if(handleables.length == 1) return handleables[0]

  let [handleable1, handleable2, ...restHandleables] = handleables

  let newHandleable = combineHandleables(
    handleable1, handleable2, combinators)

  return pipelineHandleables(
    [newHandleable, ...restHandleables], combinators)
}

let pipelineBuilder = (builders, combinators) =>
  config =>
    Promise.all(builders.map(
      builder => builder(config)))
    .then(handleables => 
      pipelineHandleables(handleables, combinators))

export class Pipeline extends ExtensibleHandler {
  constructor(options={}) {
    let { pipelineCombinators=defaultCombinators } = options

    this._pipelineCombinators = pipelineCombinators

    super(options)
    
    this.subComponents.pipelineHandlers = []
  }

  addPipe(component) {
    if(!component.isHandlerComponent) {
      throw new TypeError(
        'component must be of type HandlerComponent')
    }

    this.subComponents.pipelineHandlers.push(component)
    return this
  }

  pipe(component) {
    return this.addPipe(component)
  }

  get pipelineHandlers() {
    return this.subComponents.pipelineHandlers
  }

  toMainHandleableBuilder() {
    let builders = this.pipelineHandlers.map(
      component => component.toHandleableBuilder())

    if(builders.length == 0) throw new Error(
      'Pipeline must contain at least one handler component')

    let combinators = this._pipelineCombinators

    return pipelineBuilder(builders, combinators)
  }

  get type() {
    return 'pipeline'
  }

  toJson() {
    let json = super.toJson()
    json.pipelines = this.pipelineHandlers.map(
      component => component.toJson())

    return json
  }
}

export let pipeline = options =>
  new Pipeline(options)