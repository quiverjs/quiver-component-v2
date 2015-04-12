import { resolve } from 'quiver-promise'

import { 
  simpleToStreamHandler, 
  streamToSimpleHandler,
  validateSimpleTypes 
} from 'quiver-simple-handler'

import { simpleHandlerLoader } from './util/loader'
import { safeBuilder, safeHandler } from './util/wrap'
import { StreamHandler, StreamHandlerBuilder } from './stream-handler'

const _inType = Symbol('inputType')
const _outType = Symbol('outputType')
const _simpleHandler = Symbol('_simpleHandler')
const _simpleHandlerBuilder = Symbol('_simpleHandlerBuilder')

export class SimpleHandlerBuilder extends StreamHandlerBuilder {
  constructor(simpleHandlerBuilder, inType, outType, options={}) {
    super(null, options)

    this[_inType] = inType
    this[_outType] = outType
    this[_simpleHandlerBuilder] = simpleHandlerBuilder
  }

  toStreamHandlerBuilder() {
    const { inType, outType } = this

    const simpleHandlerBuilder = this.toSimpleHandlerBuilder()

    return config =>
      simpleHandlerBuilder(config)
      .then(simpleHandler =>
        simpleToStreamHandler(simpleHandler, inType, outType))
  }

  toSimpleHandlerBuilder() {
    const { 
      [_inType]: inputType, 
      [_outType]: outputType 
    } = this

    const err = validateSimpleTypes([inputType, outputType])
    if(err) throw err

    return safeBuilder(this[_simpleHandlerBuilder])
  }

  get defaultLoader() {
    return simpleHandlerLoader(this[_inType], this[_outType])
  }

  get inType() {
    return this[_inType]
  }

  get outType() {
    return this[_outType]
  }

  inputType(inType) {
    if(this[_inType]) {
      throw new Error('simple input type is already defined as ' + this[_inType])
    }

    const err = validateSimpleTypes([inType])
    if(err) throw err

    this[_inType] = inType
    return this
  }

  outputType(outType) {
    if(this[_outType]) {
      throw new Error('simple input type is already defined as ' + this[outType])
    }

    const err = validateSimpleTypes([outType])
    if(err) throw err

    this[_outType] = outType
    return this
  }

  get componentType() {
    return 'SimpleHandlerBuilder'
  }
}

export class SimpleHandler extends SimpleHandlerBuilder {
  constructor(simpleHandler, inType, outType, options={}) {
    super(null, inType, outType, options)
    this[_simpleHandler] = simpleHandler
  }

  toSimpleHandlerBuilder() {
    const simpleHandler = this.toSimpleHandler()

    return config =>
      resolve(simpleHandler)
  }

  toSimpleHandler() {
    return safeHandler(this[_simpleHandler])
  }

  get componentType() {
    return 'SimpleHandler'
  }
}

export const simpleHandlerBuilder = (builder, inType, outType, options) =>
  new SimpleHandlerBuilder(builder, inType, outType, options)

export const simpleHandler = (handler, inType, outType, options) =>
  new SimpleHandler(handler, inType, outType, options)