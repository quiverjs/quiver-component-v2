import 'traceur'

import {
  simpleHandlerBuilder, simpleHandler,
  transformFilter
} from '../lib/export.js'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
var should = chai.should()

describe('privatized component test', () => {
  it('single component test', () => {
    var original = simpleHandlerBuilder(
    config => {
      var { greet='Hello' } = config

      return (args, name) =>
        greet + ', ' + name
    }, 'text', 'text')

    var copy1 = original.fork()
    var copy2 = original.fork()

    should.equal(Object.getPrototypeOf(copy1), original)
    should.equal(Object.getPrototypeOf(copy2), original)

    should.not.equal(original.id, copy1.id)
    should.not.equal(original.id, copy2.id)
    should.not.equal(copy1.id, copy2.id)

    var config = { 
      greet: 'Hi'
    }

    return copy1.loadHandler(config)
    .then(handler =>
      handler({}, 'Alice')
        .should.eventually.equal('Hi, Alice'))
    .then(() => {
      config.greet = 'Yo'

      return copy1.loadHandler(config)
      .then(handler =>
        handler({}, 'Bob')
          .should.eventually.equal('Hi, Bob'))
    })
    .then(() => {
      config.greet = 'Bonjour'

      return copy2.loadHandler(config)
      .then(handler =>
        handler({}, 'Carl')
          .should.eventually.equal('Bonjour, Carl'))
    })
  })

  it('private inheritance', () => {
    var original = simpleHandlerBuilder(
    config => {
      var { greet='Hello' } = config

      return (args, name) =>
        greet + ', ' + name
    }, 'text', 'text')

    var bundle1 = {}
    var copy1 = original.fork(bundle1)
    var copy11 = original.fork(bundle1)
    should.equal(copy1.id, copy11.id)
    should.equal(copy1, copy11)

    should.equal(Object.getPrototypeOf(copy1), original)

    var copy2 = original.fork()

    should.equal(Object.getPrototypeOf(copy2), original)

    should.not.equal(original.id, copy1.id)
    should.not.equal(original.id, copy2.id)
    should.not.equal(copy1.id, copy2.id)

    var bundle2 = {}
    var copy21 = copy2.fork(bundle2)
    var copy22 = copy2.fork(bundle2)

    should.equal(copy21.id, copy22.id)
    should.equal(copy21, copy22)

    should.equal(Object.getPrototypeOf(copy21), original)
  })

  it('nested privatize', () => {
    var transformCase = simpleHandlerBuilder(
    config => {
      var { transform } = config
      var doTransform = transform == 'uppercase' ?
        string => string.toUpperCase() :
        string => string.toLowerCase()

      return (args, text) =>
        doTransform(text)
    }, 'text', 'text')

    var filter = transformFilter(transformCase, 'out')

    var filter1 = filter.fork()
    var filter2 = filter.fork()

    should.not.equal(filter1.id, filter2.id)
    should.not.equal(filter1.transformComponent.id, 
      filter2.transformComponent.id)

    var greet = simpleHandler(
      (args, name) =>
        'Hello, ' + name, 
      'text', 'text')

    var greet1 = greet.fork()
      .addMiddleware(filter1)

    var greet2  = greet.fork()
      .addMiddleware(filter1)

    var greet3 = greet.fork()
      .addMiddleware(filter2)

    var config = { transform: 'uppercase' }

    return greet1.loadHandler(config).then(handler =>
      handler({}, 'John').should.eventually.equal('HELLO, JOHN'))
    .then(() => {
      config.transform = 'lowercase'

      return greet2.loadHandler(config).then(handler =>
        handler({}, 'Bob').should.eventually.equal('HELLO, BOB'))
    })
    .then(() => {
      config.transform = 'lowercase'

      return greet3.loadHandler(config).then(handler =>
        handler({}, 'Alice').should.eventually.equal('hello, alice'))
    })
  })

  it('privatized middlewares', () => {
    var transformCase = simpleHandlerBuilder(
    config => {
      var { transform } = config
      var doTransform = transform == 'uppercase' ?
        string => string.toUpperCase() :
        string => string.toLowerCase()

      return (args, text) =>
        doTransform(text)
    }, 'text', 'text')

    var filter = transformFilter(transformCase, 'out')

    var greet = simpleHandler(
      (args, name) =>
        'Hello, ' + name, 
      'text', 'text')
    .addMiddleware(filter)

    var bundle1 = { }
    var bundle2 = { }

    var greet1 = greet.fork(bundle1)
    var uppercase = transformCase.fork(bundle1)

    var greet2 = greet.fork(bundle2)

    var config = { transform: 'uppercase' }
    
    return uppercase.loadHandler(config).then(handler =>
      handler({}, 'Test').should.eventually.equal('TEST'))
    .then(() => {
      config.transform = 'lowercase'

      return greet1.loadHandler(config).then(handler =>
        handler({}, 'Alice').should.eventually.equal('HELLO, ALICE'))
    })
    .then(() => {
      config.transform = 'lowercase'

      return greet2.loadHandler(config).then(handler =>
        handler({}, 'Bob').should.eventually.equal('hello, bob'))
    })
  })
})