import 'traceur'
import { StreamHandler } from '../lib/stream-handler.js'
import { SimpleHandler } from '../lib/simple-handler.js'
import { HttpHandlerBuilder } from '../lib/http-handler.js'

import { resolve } from 'quiver-promise'
import { streamableToText, textToStreamable } from 'quiver-stream-util'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()

describe('handler test', () => {
  it('stream handler', () => {
    var component = new StreamHandler((args, streamable) =>
      streamableToText(streamable).then(input => {
        input.should.equal('hello')
        return textToStreamable('goodbye')
      }))

    return component.handleableBuilder({})
      .then(handleable => {
        var handler = handleable.streamHandler
        var input = textToStreamable('hello')
        
        return handler({}, input).then(streamableToText)
          .should.eventually.equal('goodbye')
      })
  })

  it('simple handler', () => {
    var handler = (args, input) => {
      input.should.equal('hello')
      return 'goodbye'
    }

    var component = new SimpleHandler(handler, 'text', 'text')

    return component.loadHandler({}).then(handler =>
      handler({}, 'hello').should.eventually.equal('goodbye'))
  })

  it('http builder', () => {
    var builder = config => {
      var greet = config.greet || 'hi'

      return (requestHead, streamable) => 
        streamableToText(streamable).then(input => {
          input.should.equal('hello')
          return {
            responseHead: {
              statusCode: 200
            },
            responseStreamable: textToStreamable(greet)
          }
        })
    }

    var component = new HttpHandlerBuilder(builder)

    var config = {
      greet: 'goodbye'
    }

    return component.loadHandleable(config).then(handleable => {
      var handler = handleable.httpHandler
      should.exist(handler)

      var input = textToStreamable('hello')
      return handler({}, input).then(
        ({ responseHead, responseStreamable }) => {
          responseHead.statusCode.should.equal(200)

          return streamableToText(responseStreamable)
            .should.eventually.equal('goodbye')
        })
    })
  })
})