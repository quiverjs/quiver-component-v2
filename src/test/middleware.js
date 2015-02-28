import 'traceur'

import { async, resolve, reject } from 'quiver-promise'

import {
  simpleHandler, simpleHandlerBuilder, 
} from '../lib/export.js'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
let should = chai.should()

describe('middleware test', () => {
  it('input handler', async(function*() {
    let uppercase = simpleHandler(
      (args, input) =>  input.toUpperCase() + '!', 
      'text', 'text')

    let main = simpleHandlerBuilder(
      config => {
        let inHandler = config.inHandler
        should.exist(inHandler)

        return async(function*(args, input) {
          let result = yield inHandler(args, input)
          
          return {
            status: 'ok',
            result
          }
        })
      }, 'text', 'json')
    .inputHandler(uppercase, 'inHandler')

    let handler = yield main.loadHandler({})
    let json = yield handler({}, 'hello')

    json.status.should.equal('ok')
    json.result.should.equal('HELLO!')
  }))

  it('config override', async(function*() {
    let main = simpleHandlerBuilder(
      config => {
        config.foo.should.equal('bar')

        return args => 'hello'
      }, 'void', 'text')
    .configOverride({
      foo: 'bar'
    })

    let config = {
      foo: 'foo'
    }

    yield main.loadHandler(config)
  }))

  it('config alias', async(function*() {
    let main = simpleHandlerBuilder(
      config => {
        config.foo.should.equal('bar')

        return args => 'hello'
      }, 'void', 'text')
    .configAlias({
      foo: 'bar'
    })

    let config = {
      bar: 'bar'
    }

    yield main.loadHandler(config)
  }))
})