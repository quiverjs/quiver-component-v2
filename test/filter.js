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
    var filterComponent = new StreamFilter(
      (config, handler) =>
        (args, streamable) =>
          uppercaseStream(streamable).then(streamable =>
            handler(args, streamable).then(uppercaseStream)))

    var handlerComponent = new SimpleHandler(
      (args, input) => {
        input.should.equal('HELLO!')
        return 'goodbye'
      }, 'text', 'text')
    .addMiddleware(filterComponent)

    return handlerComponent.loadHandler({}).then(handler =>
      handler({}, 'hello')).should.eventually.equal('GOODBYE!')
  })

  it('transform filter', () => {
    var transformComponent = new SimpleHandler(
      (args, input) =>
        input.toUpperCase() + '!', 
      'text', 'text')

    var filterComponent = new TransformFilter(transformComponent, 'inout')

    var handlerComponent = new SimpleHandler(
      (args, input) => {
        input.should.equal('HELLO!')
        return 'goodbye'
      }, 'text', 'text')
    .addMiddleware(filterComponent)

    return handlerComponent.loadHandler({}).then(handler =>
      handler({}, 'hello')).should.eventually.equal('GOODBYE!')
  })

  it('args filter', () => {
    var filterComponent = new ArgsFilter(
      args => {
        args.foo = 'bar'
        return args
      })

    var handlerComponent = new SimpleHandler(
      args => {
        args.foo.should.equal('bar')
        return 'foo'
      }, 'void', 'text')
    .addMiddleware(filterComponent)

    return handlerComponent.loadHandler({}).then(handler =>
      handler({})).should.eventually.equal('foo')
  })

  it('args builder filter', () => {
    var filterComponent = new ArgsBuilderFilter(
      config => {
        var fooValue = config.fooValue

        return args => {
          args.foo = fooValue
          return args
        }
      })

    var handlerComponent = new SimpleHandler(
      args => {
        args.foo.should.equal('bar')
        return 'foo'
      }, 'void', 'text')
    .addMiddleware(filterComponent)

    return handlerComponent.loadHandler({ fooValue: 'bar' })
      .then(handler => handler({}))
      .should.eventually.equal('foo')
  })

  it('error filter', () => {
    var filterComponent = new ErrorFilter(
      err => textToStreamable('error caught from filter'))

    var handlerComponent = new SimpleHandler(
      args => {
        throw new Error('error in handler')
      }, 'void', 'text')
    .addMiddleware(filterComponent)

    return handlerComponent.loadHandler({}).then(handler =>
      handler({})).should.eventually.equal('error caught from filter')
  })

  it('input handler', () => {
    var inputComponent = new SimpleHandler(
      (args, input) =>  input.toUpperCase() + '!', 
      'text', 'text')

    var filterComponent = new InputHandlerMiddleware(
      inputComponent, 'inHandler')

    var handlerComponent = new SimpleHandlerBuilder(
      config => {
        var inHandler = config.inHandler
        should.exist(inHandler)

        return (args, input) =>
          inHandler(args, input).then(result => ({
            status: 'ok',
            result
          }))
      }, 'text', 'json')
    .addMiddleware(filterComponent)

    return handlerComponent.loadHandler({}).then(handler =>
      handler({}, 'hello').then(json => {
        json.status.should.equal('ok')
        json.result.should.equal('HELLO!')
      }))
  })
})