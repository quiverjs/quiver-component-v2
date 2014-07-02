import 'traceur'

import { resolve } from 'quiver-promise'
import { streamableToText, textToStreamable } from 'quiver-stream-util'

import { SimpleHandler } from '../lib/simple-handler.js'
import { StreamFilter } from '../lib/filter.js'

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
    var handler = (args, input) => {
      input.should.equal('HELLO!')
      return 'goodbye'
    }

    var handlerComponent = new SimpleHandler(handler, 
      { inType: 'text', outType: 'text' })

    var filter = (config, handler) =>
      (args, streamable) =>
        uppercaseStream(streamable).then(streamable =>
          handler(args, streamable).then(uppercaseStream))

    var filterComponent = new StreamFilter(filter)

    handlerComponent.addMiddleware(filterComponent)

    return handlerComponent.loadHandler({}).then(handler =>
      handler({}, 'hello')).should.eventually.equal('GOODBYE!')
  })
})