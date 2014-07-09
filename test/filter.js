import 'traceur'

import { resolve } from 'quiver-promise'
import { streamToSimpleHandler } from 'quiver-simple-handler'
import { 
  streamableToText, textToStreamable, 
  emptyStreamable, jsonToStreamable
} from 'quiver-stream-util'

import {
  simpleHandler, simpleHandlerBuilder, handleable,
  streamFilter, transformFilter,
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
  it('simple handler', () => {
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

    return main.loadHandler({}).then(handler =>
      handler({}, 'hello')).should.eventually.equal('GOODBYE!')
  })

  it('transform filter', () => {
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

    return main.loadHandler({}).then(handler =>
      handler({}, 'hello')).should.eventually.equal('GOODBYE!')
  })

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

  it('args helper filter', () => {
    var filter = argsFilter(
      args => {
        args.foo = 'bar'
        return args
      })

    var main = handleable({
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

    return main.loadHandleable({}).then(handleable => {
      var mainHandler = streamToSimpleHandler(
        handleable.streamHandler, 'void', 'text')

      var cacheIdHandler = streamToSimpleHandler(
        handleable.meta.cacheId, 'void', 'json')

      var p1 = mainHandler({}).should.eventually.equal('main')
      var p2 = cacheIdHandler({}).then(json => {
        json.cacheId.should.equal(123)
      })

      return Promise.all([p1, p2])
    })
  })

  it('error filter', () => {
    var filter = errorFilter(
      err => textToStreamable('error caught from filter'))

    var main = simpleHandler(
      args => {
        throw new Error('error in handler')
      }, 'void', 'text')
    .addMiddleware(filter)

    return main.loadHandler({}).then(handler =>
      handler({})).should.eventually.equal('error caught from filter')
  })

  it('input handler', () => {
    var uppercase = simpleHandler(
      (args, input) =>  input.toUpperCase() + '!', 
      'text', 'text')

    var filter = inputHandlerMiddleware(
      uppercase, 'inHandler')

    var main = simpleHandlerBuilder(
      config => {
        var inHandler = config.inHandler
        should.exist(inHandler)

        return (args, input) =>
          inHandler(args, input).then(result => ({
            status: 'ok',
            result
          }))
      }, 'text', 'json')
    .addMiddleware(filter)

    return main.loadHandler({}).then(handler =>
      handler({}, 'hello').then(json => {
        json.status.should.equal('ok')
        json.result.should.equal('HELLO!')
      }))
  })
})