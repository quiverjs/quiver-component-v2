import 'traceur'

import { Pipeline } from '../lib/pipeline.js'
import { SimpleHandler } from '../lib/simple-handler.js'
import { loadSimpleHandler } from '../lib/util/loader.js'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()

describe.only('pipeline handler test', () => {
  it('simple pipeline', () => {
    var handler1 = args =>
      'hello, ' + args.name

    var handler2 = (args, input) =>
      input.toUpperCase()

    var handler3 = (args, input) => ({
      status: 'ok',
      result: input
    })

    var component1 = new SimpleHandler(handler1, 'void', 'text')
    var component2 = new SimpleHandler(handler2, 'text', 'text')
    var component3 = new SimpleHandler(handler3, 'text', 'json')

    var pipeline = new Pipeline([component1, component2, component3])
    
    return loadSimpleHandler({}, pipeline, 'void', 'json')
    .then(handler => 
      handler({ name: 'bob' })
      .then(result => {
        result.status.should.equal('ok')
        result.result.should.equal('HELLO, BOB')
      }))
  })
})