import 'traceur'

import { async, resolve, reject } from 'quiver-promise'
import { streamToSimpleHandler } from 'quiver-simple-handler'
import { 
  streamableToText, textToStreamable, 
  emptyStreamable, jsonToStreamable
} from 'quiver-stream-util'

import { RequestHead } from 'quiver-http'

import {
  simpleHandler, simpleHandlerBuilder, 
  handleable as makeHandleable,
  streamFilter, httpFilter, transformFilter,
  argsFilter, argsBuilderFilter, errorFilter,
} from '../lib/export.js'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
var should = chai.should()

var uppercaseStream = streamable =>
  streamableToText(streamable).then(text => {
    var newText = text.toUpperCase() + '!'
    return textToStreamable(newText)
  })

describe('filter test', () => {
  it('simple handler', async(function*() {
    var filter = streamFilter(
      (config, handler) =>
        (args, streamable) =>
          uppercaseStream(streamable).then(streamable =>
            handler(args, streamable).then(uppercaseStream)))

    var main = simpleHandler(
      (args, input) => {
        input.should.equal('HELLO!')
        return 'goodbye'
      }, 'text', 'text')
    .middleware(filter)

    var handler = yield main.loadHandler({})
    
    yield handler({}, 'hello')
      .should.eventually.equal('GOODBYE!')
  }))

  it('transform filter', async(function*() {
    var uppercase = simpleHandler(
      (args, input) =>
        input.toUpperCase() + '!', 
      'text', 'text')

    var filter = transformFilter(uppercase, 'inout')

    var main = simpleHandler(
      (args, input) => {
        input.should.equal('HELLO!')
        return 'goodbye'
      }, 'text', 'text')
    .middleware(filter)

    var handler = yield main.loadHandler({})
    
    yield handler({}, 'hello')
      .should.eventually.equal('GOODBYE!')
  }))

  it('args filter', () => {
    var filter = argsFilter(
      args => {
        args.foo = 'bar'
      })

    var main = simpleHandler(
      args => {
        args.foo.should.equal('bar')
        return 'foo'
      }, 'void', 'text')
    .middleware(filter)

    return main.loadHandler({}).then(handler =>
      handler({}))
    .should.eventually.equal('foo')
  })

  it('args builder filter', async(function*() {
    var filter = argsBuilderFilter(
      config => {
        should.not.exist(config.handlerModified)
        config.filterModified = true

        var fooValue = config.fooValue

        return args => {
          args.foo = fooValue
        }
      })

    var main = simpleHandlerBuilder(
      config => {
        should.not.exist(config.filterModified)
        config.handlerModified = true

        return args => {
          args.foo.should.equal('bar')
          return 'foo'
        }
      }, 'void', 'text')
    .middleware(filter)

    var config = { fooValue: 'bar' }
    var handler = yield main.loadHandler(config)

    yield handler({}).should.eventually.equal('foo')
  }))

  it('error filter', async(function*() {
    var filter = errorFilter(
      err => textToStreamable('error caught from filter'))

    var main = simpleHandler(
      args => {
        throw new Error('error in handler')
      }, 'void', 'text')
    .middleware(filter)

    var handler = yield main.loadHandler({})

    yield handler({}).should.eventually.equal(
      'error caught from filter')
  }))

  it('stream handler on http filter', async(function*() {
    var filter = httpFilter(
      (config, handler) => handler)

    var main = simpleHandler(
      args => 'Hello World',
      'void', 'text')
    .middleware(filter)

    var handleable = yield main.loadHandleable({})

    var {
      streamHandler,
      httpHandler
    } = handleable

    should.not.exist(streamHandler)
    should.exist(httpHandler)

    var [
      responseHead, responseStreamable
    ] = yield httpHandler(new RequestHead(), emptyStreamable())

    responseHead.statusCode.should.equal(200)

    yield streamableToText(responseStreamable)
      .should.eventually.equal('Hello World')
  }))
})