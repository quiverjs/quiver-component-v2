import 'traceur'

import { async, resolve } from 'quiver-promise'
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
  inputHandlerMiddleware
} from '../lib/export.js'

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
    .addMiddleware(filter)

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
    .addMiddleware(filter)

    var handler = yield main.loadHandler({})
    
    yield handler({}, 'hello')
      .should.eventually.equal('GOODBYE!')
  }))

  it('args filter', () => {
    var filter = argsFilter(
      args => {
        args.foo = 'bar'
        return args
      })

    var main = simpleHandler(
      args => {
        args.foo.should.equal('bar')
        return 'foo'
      }, 'void', 'text')
    .addMiddleware(filter)

    return main.loadHandler({}).then(handler =>
      handler({}))
    .should.eventually.equal('foo')
  })

  it('args builder filter', () => {
    var filter = argsBuilderFilter(
      config => {
        var fooValue = config.fooValue

        return args => {
          args.foo = fooValue
          return args
        }
      })

    var main = simpleHandler(
      args => {
        args.foo.should.equal('bar')
        return 'foo'
      }, 'void', 'text')
    .addMiddleware(filter)

    return main.loadHandler({ fooValue: 'bar' })
      .then(handler => handler({}))
      .should.eventually.equal('foo')
  })

  it('args helper filter', async(function*() {
    var filter = argsFilter(
      args => {
        args.foo = 'bar'
        return args
      })

    var main = makeHandleable({
      streamHandler: (args, streamable) => {
        args.foo.should.equal('bar')
        return textToStreamable('main')
      },
      meta: {
        cacheId: (args, streamable) => {
          args.foo.should.equal('bar')
          return jsonToStreamable({ cacheId: 123 })
        }
      }
    })
    .addMiddleware(filter)

    var handleable = yield main.loadHandleable({})
    var mainHandler = streamToSimpleHandler(
      handleable.streamHandler, 'void', 'text')

    var cacheIdHandler = streamToSimpleHandler(
      handleable.meta.cacheId, 'void', 'json')

    yield mainHandler({})
      .should.eventually.equal('main')

    var json = yield cacheIdHandler({})
    json.cacheId.should.equal(123)
  }))

  it('error filter', async(function*() {
    var filter = errorFilter(
      err => textToStreamable('error caught from filter'))

    var main = simpleHandler(
      args => {
        throw new Error('error in handler')
      }, 'void', 'text')
    .addMiddleware(filter)

    var handler = yield main.loadHandler({})

    yield handler({}).should.eventually.equal(
      'error caught from filter')
  }))

  it('input handler', async(function*() {
    var uppercase = simpleHandler(
      (args, input) =>  input.toUpperCase() + '!', 
      'text', 'text')

    var filter = inputHandlerMiddleware(
      uppercase, 'inHandler')

    var main = simpleHandlerBuilder(
      config => {
        var inHandler = config.inHandler
        should.exist(inHandler)

        return async(function*(args, input) {
          var result = yield inHandler(args, input)
          
          return {
            status: 'ok',
            result
          }
        })
      }, 'text', 'json')
    .addMiddleware(filter)

    var handler = yield main.loadHandler({})
    var json = yield handler({}, 'hello')

    json.status.should.equal('ok')
    json.result.should.equal('HELLO!')
  }))

  it('stream handler on http filter', async(function*() {
    var filter = httpFilter(
      (config, handler) => handler)

    var main = simpleHandler(
      args => 'Hello World',
      'void', 'text')
    .addMiddleware(filter)

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