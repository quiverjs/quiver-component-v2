import 'traceur'

import { resolve } from 'quiver-promise'
import { streamableToText, textToStreamable } from 'quiver-stream-util'

import {
  SimpleHandler, SimpleHandlerBuilder ,
  StreamFilter, TransformFilter,
  ArgsFilter, ArgsBuilderFilter, ErrorFilter,
  InputHandlerMiddleware
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
    var filter = new StreamFilter(
      (config, handler) =>
        (args, streamable) =>
          uppercaseStream(streamable).then(streamable =>
            handler(args, streamable).then(uppercaseStream)))

    var main = new SimpleHandler(
      (args, input) => {
        input.should.equal('HELLO!')
        return 'goodbye'
      }, 'text', 'text')
    .addMiddleware(filter)

    return main.loadHandler({}).then(handler =>
      handler({}, 'hello')).should.eventually.equal('GOODBYE!')
  })

  it('transform filter', () => {
    var uppercaseHandler = new SimpleHandler(
      (args, input) =>
        input.toUpperCase() + '!', 
      'text', 'text')

    var filter = new TransformFilter(uppercaseHandler, 'inout')

    var main = new SimpleHandler(
      (args, input) => {
        input.should.equal('HELLO!')
        return 'goodbye'
      }, 'text', 'text')
    .addMiddleware(filter)

    return main.loadHandler({}).then(handler =>
      handler({}, 'hello')).should.eventually.equal('GOODBYE!')
  })

  it('args filter', () => {
    var filter = new ArgsFilter(
      args => {
        args.foo = 'bar'
        return args
      })

    var main = new SimpleHandler(
      args => {
        args.foo.should.equal('bar')
        return 'foo'
      }, 'void', 'text')
    .addMiddleware(filter)

    return main.loadHandler({}).then(handler =>
      handler({})).should.eventually.equal('foo')
  })

  it('args builder filter', () => {
    var filter = new ArgsBuilderFilter(
      config => {
        var fooValue = config.fooValue

        return args => {
          args.foo = fooValue
          return args
        }
      })

    var main = new SimpleHandler(
      args => {
        args.foo.should.equal('bar')
        return 'foo'
      }, 'void', 'text')
    .addMiddleware(filter)

    return main.loadHandler({ fooValue: 'bar' })
      .then(handler => handler({}))
      .should.eventually.equal('foo')
  })

  it('error filter', () => {
    var filter = new ErrorFilter(
      err => textToStreamable('error caught from filter'))

    var main = new SimpleHandler(
      args => {
        throw new Error('error in handler')
      }, 'void', 'text')
    .addMiddleware(filter)

    return main.loadHandler({}).then(handler =>
      handler({})).should.eventually.equal('error caught from filter')
  })

  it('input handler', () => {
    var uppercaseHandler = new SimpleHandler(
      (args, input) =>  input.toUpperCase() + '!', 
      'text', 'text')

    var filter = new InputHandlerMiddleware(
      uppercaseHandler, 'inHandler')

    var main = new SimpleHandlerBuilder(
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