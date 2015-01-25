import 'traceur'

import {
  pipeline, simpleHandler, simpleHandlerLoader
} from '../lib/export.js'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
let should = chai.should()

describe('pipeline handler test', () => {
  it('simple pipeline', () => {
    let handler1 = simpleHandler(
      args => 'hello, ' + args.name, 
      'void', 'text')

    let handler2 = simpleHandler(
      (args, input) => input.toUpperCase(), 
      'text', 'text')

    let handler3 = simpleHandler(
      (args, input) => ({
        status: 'ok',
        result: input
      }), 'text', 'json')

    let main = pipeline()
      .addPipe(handler1)
      .addPipe(handler2)
      .addPipe(handler3)
      .setLoader(simpleHandlerLoader('void', 'json'))
    
    return main.loadHandler({})
    .then(handler => 
      handler({ name: 'bob' })
      .then(result => {
        result.status.should.equal('ok')
        result.result.should.equal('HELLO, BOB')
      }))
  })
})