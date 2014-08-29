import 'traceur'

import {
  streamHandler, simpleHandler, httpHandlerBuilder
} from '../lib/export.js'

import { resolve } from 'quiver-promise'
import { streamableToText, textToStreamable } from 'quiver-stream-util'

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
        return 'goodbye'
      }, 'text', 'text')

    return main.loadHandler({}).then(handler =>
      handler({}, 'hello').should.eventually.equal('goodbye'))
  })

  it('http builder', () => {
    var main = httpHandlerBuilder(
      config => {
        var greet = config.greet || 'hi'

        return (requestHead, streamable) => 
          streamableToText(streamable).then(input => {
            input.should.equal('hello')
            return [
              { statusCode: 200 },
              textToStreamable(greet)
            ]
          })
      })

    var config = {
      greet: 'goodbye'
    }

    return main.loadHandleable(config).then(handleable => {
      var handler = handleable.httpHandler
      should.exist(handler)

      var input = textToStreamable('hello')
      return handler({}, input).then(
        ([responseHead, responseStreamable]) => {
          responseHead.statusCode.should.equal(200)

          return streamableToText(responseStreamable)
            .should.eventually.equal('goodbye')
        })
    })
  })
})