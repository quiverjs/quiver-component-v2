import 'traceur'

import {
  Pipeline, SimpleHandler, loadSimpleHandler
} from '../lib/export.js'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()

describe('pipeline handler test', () => {
  it('simple pipeline', () => {
    var handler1 = new SimpleHandler(
      args => 'hello, ' + args.name, 
      'void', 'text')

    var handler2 = new SimpleHandler(
      (args, input) => input.toUpperCase(), 
      'text', 'text')

    var handler3 = new SimpleHandler(
      (args, input) => ({
        status: 'ok',
        result: input
      }), 'text', 'json')

    var pipeline = new Pipeline()
      .addPipe(handler1)
      .addPipe(handler2)
      .addPipe(handler3)
    
    return loadSimpleHandler({}, pipeline, 'void', 'json')
    .then(handler => 
      handler({ name: 'bob' })
      .then(result => {
        result.status.should.equal('ok')
        result.result.should.equal('HELLO, BOB')
      }))
  })
})