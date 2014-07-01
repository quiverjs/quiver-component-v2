import 'traceur'
import { StreamHandler } from '../lib/stream-handler.js'
import { SimpleHandler } from '../lib/simple-handler.js'

import { resolve } from 'quiver-promise'
import { streamableToText, textToStreamable } from 'quiver-stream-util'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
chai.should()

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
      return resolve('goodbye')
    }

    var component = new SimpleHandler(handler, 
      { inType: 'text', outType: 'text' })

    return component.loadHandler({}).then(handler =>
      handler({}, 'hello').should.eventually.equal('goodbye'))
  })
})