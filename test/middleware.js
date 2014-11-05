import 'traceur'

import { async, resolve, reject } from 'quiver-promise'

import {
  simpleHandler, simpleHandlerBuilder, 
} from '../lib/export.js'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
var should = chai.should()

describe('middleware test', () => {
  it('input handler', async(function*() {
    var uppercase = simpleHandler(
      (args, input) =>  input.toUpperCase() + '!', 
      'text', 'text')

    var main = simpleHandlerBuilder(
      config => {
        var inHandler = config.inHandler
        should.exist(inHandler)

        return async(function*(args, input) {
          var result = yield inHandler(args, input)
          
          return {
            status: 'ok',
            result
          }
        })
      }, 'text', 'json')
    .inputHandler(uppercase, 'inHandler')

    var handler = yield main.loadHandler({})
    var json = yield handler({}, 'hello')

    json.status.should.equal('ok')
    json.result.should.equal('HELLO!')
  }))

  it('config override', async(function*() {
    var main = simpleHandlerBuilder(
      config => {
        config.foo.should.equal('bar')

        return args => 'hello'
      }, 'void', 'text')
    .configOverride({
      foo: 'bar'
    })

    var config = {
      foo: 'foo'
    }

    yield main.loadHandler(config)
  }))

  it('config alias', async(function*() {
    var main = simpleHandlerBuilder(
      config => {
        config.foo.should.equal('bar')

        return args => 'hello'
      }, 'void', 'text')
    .configAlias({
      foo: 'bar'
    })

    var config = {
      bar: 'bar'
    }

    yield main.loadHandler(config)
  }))
})