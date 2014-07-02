import 'traceur'

import { resolve } from 'quiver-promise'
import { streamableToText, textToStreamable } from 'quiver-stream-util'

import { SimpleHandler } from '../lib/simple-handler.js'
import { StreamFilter } from '../lib/filter.js'
import { TransformFilter } from '../lib/transform-filter.js'

import { 
  ArgsFilter, ArgsBuilderFilter, ErrorFilter 
} from '../lib/simple-filter.js'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()

var uppercaseStream = streamable =>
  streamableToText(streamable).then(text => {
    var newText = text.toUpperCase() + '!'
    return textToStreamable(newText)
  })

describe('filter test', () => {
  it('simple handler', () => {
    var handler = (args, input) => {
      input.should.equal('HELLO!')
      return 'goodbye'
    }

    var handlerComponent = new SimpleHandler(handler, 
      { inType: 'text', outType: 'text' })

    var filter = (config, handler) =>
      (args, streamable) =>
        uppercaseStream(streamable).then(streamable =>
          handler(args, streamable).then(uppercaseStream))

    var filterComponent = new StreamFilter(filter)

    handlerComponent.addMiddleware(filterComponent)

    return handlerComponent.loadHandler({}).then(handler =>
      handler({}, 'hello')).should.eventually.equal('GOODBYE!')
  })

  it('transform filter', () => {
    var handler = (args, input) => {
      input.should.equal('HELLO!')
      return 'goodbye'
    }

    var handlerComponent = new SimpleHandler(handler, 
      { inType: 'text', outType: 'text' })

    var transformHandler = (args, input) =>
      input.toUpperCase() + '!'

    var transformComponent = new SimpleHandler(transformHandler, 
      { inType: 'text', outType: 'text' })

    var filterComponent = new TransformFilter(transformComponent, {
      transformMode: 'inout'
    })

    handlerComponent.addMiddleware(filterComponent)

    return handlerComponent.loadHandler({}).then(handler =>
      handler({}, 'hello')).should.eventually.equal('GOODBYE!')
  })

  it('args filter', () => {
    var handler = args => {
      args.foo.should.equal('bar')
      return 'foo'
    }

    var handlerComponent = new SimpleHandler(handler, 
      { inType: 'void', outType: 'text' })

    var argsFilter = args => {
      args.foo = 'bar'
      return args
    }

    var filterComponent = new ArgsFilter(argsFilter)
    handlerComponent.addMiddleware(filterComponent)

    return handlerComponent.loadHandler({}).then(handler =>
      handler({})).should.eventually.equal('foo')
  })

  it('args builder filter', () => {
    var handler = args => {
      args.foo.should.equal('bar')
      return 'foo'
    }

    var handlerComponent = new SimpleHandler(handler, 
      { inType: 'void', outType: 'text' })

    var argsBuilder = config => {
      var fooValue = config.fooValue

      return args => {
        args.foo = fooValue
        return args
      }
    }

    var filterComponent = new ArgsBuilderFilter(argsBuilder)
    handlerComponent.addMiddleware(filterComponent)

    return handlerComponent.loadHandler({ fooValue: 'bar' })
      .then(handler => handler({}))
      .should.eventually.equal('foo')
  })

  it('error filter', () => {
    var handler = args => {
      throw new Error('error in handler')
    }

    var handlerComponent = new SimpleHandler(handler, 
      { inType: 'void', outType: 'text' })

    var errorFilter = err =>
      textToStreamable('error caught from filter')

    var filterComponent = new ErrorFilter(errorFilter)
    handlerComponent.addMiddleware(filterComponent)

    return handlerComponent.loadHandler({}).then(handler =>
      handler({})).should.eventually.equal('error caught from filter')
  })
})