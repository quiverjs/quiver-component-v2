import 'traceur'

import {
  simpleHandler, simpleHandlerBuilder, 
  streamHandler, httpHandler,
  protocol, abstractComponent
} from '../lib/export.js'

import { async } from 'quiver-promise'
import { streamableToText, emptyStreamable } from 'quiver-stream-util'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
var should = chai.should()
var expect = chai.expect

describe('protocol test', () => {
  var fooProtocol = protocol()
      .simpleHandler('foo', 'text', 'text')
      .streamHandler('bar')

  var foo = simpleHandler((args, text) => {
    return 'hello, ' + text
  }, 'text', 'text')

  var bar = simpleHandler(args => 'Bar', 
    'void', 'text')

  it('basic test', async(function*() {
    expect(() => 
      fooProtocol.implement({ foo }))
      .to.throw()

    var impl = fooProtocol.implement(
      { foo, bar })

    var bundle = yield impl.loadHandlers({})

    var fooHandler = bundle.foo
    should.exist(fooHandler)

    var barHandler = bundle.bar
    should.exist(barHandler)

    yield fooHandler({}, 'world')
      .should.eventually.equal('hello, world')

    yield streamableToText(yield barHandler(
      {}, emptyStreamable()))
        .should.eventually.equal('Bar')
  }))

  it('sub protocol test', async(function*() {
    var bazProtocol = protocol()
      .simpleHandler('baz', 'void', 'text')
      .subprotocol(fooProtocol)

    var baz = simpleHandler(args => 'Baz', 'void', 'text')
    var impl = bazProtocol.implement({
      foo, bar, baz
    })

    var bundle = yield impl.loadHandlers({})
    var bazHandler = bundle.baz
    should.exist(bazHandler)

    var fooHandler = bundle.foo
    should.exist(fooHandler)

    var barHandler = bundle.bar
    should.exist(barHandler)

    yield fooHandler({}, 'world')
      .should.eventually.equal('hello, world')

    yield streamableToText(
      yield barHandler({}, emptyStreamable()))
      .should.eventually.equal('Bar')

    yield bazHandler({}).should.eventually.equal('Baz')
  }))

  it('astract component test', async(function*() {
    var abstractHandler = abstractComponent(
      'inBundle', fooProtocol,
      simpleHandlerBuilder(async(function*(config) {
        var inBundle = config.inBundle
        should.exist(inBundle)

        var fooHandler = inBundle.foo
        should.exist(fooHandler)

        var fooResult = yield fooHandler({}, 'Foo')
        fooResult.should.equal('hello, Foo')

        return args => fooResult
      }), 'void', 'text'))

    var concrete = abstractHandler
      .implement({ foo, bar })
      .concretize()

    var handler = yield concrete.loadHandler({})
    var result = yield handler({})

    result.should.equal('hello, Foo')
  }))
})