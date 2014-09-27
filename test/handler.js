import 'traceur'

import { async, resolve } from 'quiver-promise'

import { 
  RequestHead, ResponseHead 
} from 'quiver-http'

import { 
  streamableToText, textToStreamable 
} from 'quiver-stream-util'

import {
  streamHandler, simpleHandler, httpHandlerBuilder
} from '../lib/export.js'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()

describe('handler test', () => {
  it('stream handler', () => {
    var main = streamHandler(
      (args, streamable) =>
        streamableToText(streamable).then(input => {
          input.should.equal('hello')
          return textToStreamable('goodbye')
        }))

    return main.handleableBuilder({})
      .then(handleable => {
        var handler = handleable.streamHandler
        var input = textToStreamable('hello')
        
        return handler({}, input).then(streamableToText)
          .should.eventually.equal('goodbye')
      })
  })

  it('simple handler', () => {
    var main = simpleHandler(
      (args, input) => {
        input.should.equal('hello')
        return '<b>goodbye</b>'
      }, 'text', 'html')

    return main.loadHandler({}).then(handler =>
      handler({}, 'hello').should.eventually.equal('<b>goodbye</b>'))
  })

  it('http builder', async(function*() {
    var main = httpHandlerBuilder(
      config => {
        var greet = config.greet || 'hi'
        config.modified = true

        return async(function*(requestHead, streamable) {
          var input = yield streamableToText(streamable)
          input.should.equal('hello')

          return [
            new ResponseHead(),
            textToStreamable(greet)
          ]
        })
      })

    var config = {
      greet: 'goodbye'
    }

    var handleable = yield main.loadHandleable(config)
    should.not.exist(config.modified)

    var handler = handleable.httpHandler
    should.exist(handler)

    var input = textToStreamable('hello')
    var [responseHead, responseStreamable] = 
      yield handler(new RequestHead(), input)

    responseHead.statusCode.should.equal(200)

    yield streamableToText(responseStreamable)
      .should.eventually.equal('goodbye')
  }))
})