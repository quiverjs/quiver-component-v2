import 'traceur'

import {
  SimpleHandlerBuilder
} from '../lib/export.js'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()

describe.only('privatized component test', () => {
  it('single component test', () => {
    var original = new SimpleHandlerBuilder(
    config => {
      var { greet='Hello' } = config

      return (args, name) =>
        greet + ', ' + name
    }, 'text', 'text')

    var copy1 = original.makePrivate()
    var copy2 = original.makePrivate()

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
    var original = new SimpleHandlerBuilder(
    config => {
      var { greet='Hello' } = config

      return (args, name) =>
        greet + ', ' + name
    }, 'text', 'text')

    var bundle1 = {}
    var copy1 = original.makePrivate(bundle1)
    var copy11 = original.makePrivate(bundle1)
    should.equal(copy1.id, copy11.id)
    should.equal(copy1, copy11)

    should.equal(Object.getPrototypeOf(copy1), original)

    var copy2 = original.makePrivate()

    should.equal(Object.getPrototypeOf(copy2), original)

    should.not.equal(original.id, copy1.id)
    should.not.equal(original.id, copy2.id)
    should.not.equal(copy1.id, copy2.id)

    var bundle2 = {}
    var copy21 = copy2.makePrivate(bundle2)
    var copy22 = copy2.makePrivate(bundle2)

    should.equal(copy21.id, copy22.id)
    should.equal(copy21, copy22)

    should.equal(Object.getPrototypeOf(copy21), original)
  })
})