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

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
let should = chai.should()

describe('handler test', () => {
  it('stream handler', () => {
    let main = streamHandler(
      (args, streamable) =>
        streamableToText(streamable).then(input => {
          input.should.equal('hello')
          return textToStreamable('goodbye')
        }))

    return main.toHandleableBuilder()({})
      .then(handleable => {
        let handler = handleable.streamHandler
        let input = textToStreamable('hello')
        
        return handler({}, input).then(streamableToText)
          .should.eventually.equal('goodbye')
      })
  })

  it('simple handler', () => {
    let main = simpleHandler(
      (args, input) => {
        input.should.equal('hello')
        return '<b>goodbye</b>'
      }, 'text', 'html')

    return main.loadHandler({}).then(handler =>
      handler({}, 'hello').should.eventually.equal('<b>goodbye</b>'))
  })

  it('http builder', async(function*() {
    let main = httpHandlerBuilder(
      config => {
        let greet = config.greet || 'hi'
        config.modified = true

        return async(function*(requestHead, streamable) {
          let input = yield streamableToText(streamable)
          input.should.equal('hello')

          return [
            new ResponseHead(),
            textToStreamable(greet)
          ]
        })
      })

    let config = {
      greet: 'goodbye'
    }

    let handleable = yield main.loadHandleable(config)
    should.not.exist(config.modified)

    let handler = handleable.httpHandler
    should.exist(handler)

    let input = textToStreamable('hello')
    let [responseHead, responseStreamable] = 
      yield handler(new RequestHead(), input)

    responseHead.statusCode.should.equal(200)

    yield streamableToText(responseStreamable)
      .should.eventually.equal('goodbye')
  }))
})