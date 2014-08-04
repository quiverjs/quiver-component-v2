import 'traceur'

import {
  simpleHandler, simpleHandlerBuilder, 
  streamHandler, httpHandler
} from '../lib/export.js'

import { protocol } from '../lib/protocol.js'
import { abstractComponent } from '../lib/abstract.js'
import { async } from 'quiver-promise'
import { streamableToText, emptyStreamable } from 'quiver-stream-util'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

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

  var bar = simpleHandler(args => 'Bar', 'void', 'text')

  it('basic test', async(function*() {
    expect(() => 
      fooProtocol.implement({ foo }))
      .to.throw()

    var impl = fooProtocol.implement(
      { foo, bar })

    var bundle = yield impl.load({})

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
      .subprotocol('sub', fooProtocol)

    var baz = simpleHandler(args => 'Baz', 'void', 'text')
    var impl = bazProtocol.implement({
      baz, sub: {
        foo, bar
      }
    })

    var bundle = yield impl.load({})
    var bazHandler = bundle.baz
    should.exist(bazHandler)

    var subBundle = bundle.sub
    should.exist(subBundle)

    var fooHandler = subBundle.foo
    should.exist(fooHandler)

    var barHandler = subBundle.bar
    should.exist(barHandler)

    yield fooHandler({}, 'world')
      .should.eventually.equal('hello, world')

    yield streamableToText(yield barHandler(
      {}, emptyStreamable()))
        .should.eventually.equal('Bar')

    yield bazHandler({}).should.eventually.equal('Baz')
  }))

  it('sub protocol test', async(function*() {
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

    var concrete = abstractHandler({ foo, bar })

    var handler = yield concrete.loadHandler({})
    var result = yield handler({})

    result.should.equal('hello, Foo')
  }))
})