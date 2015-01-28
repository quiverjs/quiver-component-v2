import 'traceur'

import { async } from 'quiver-promise'

import {
  simpleHandlerBuilder, simpleHandler,
  transformFilter, configMiddleware
} from '../lib/export.js'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
let should = chai.should()

describe('base component test', () => {
  it('single component test', () => {
    let original = simpleHandlerBuilder(
    config => {
      let { greet='Hello' } = config

      return (args, name) =>
        greet + ', ' + name
    }, 'text', 'text')

    let copy1 = original.fork()
    let copy2 = original.fork()

    should.equal(Object.getPrototypeOf(copy1), original)
    should.equal(Object.getPrototypeOf(copy2), original)

    should.not.equal(original.id, copy1.id)
    should.not.equal(original.id, copy2.id)
    should.not.equal(copy1.id, copy2.id)

    let config = { 
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

  it('basic fork', () => {
    let original = simpleHandlerBuilder(
    config => {
      let { greet='Hello' } = config

      return (args, name) =>
        greet + ', ' + name
    }, 'text', 'text')

    let bundle1 = {}
    let copy1 = original.fork(bundle1)
    let copy11 = original.fork(bundle1)
    should.equal(copy1.id, copy11.id)
    should.equal(copy1, copy11)

    should.equal(Object.getPrototypeOf(copy1), original)

    let copy2 = original.fork()

    should.equal(Object.getPrototypeOf(copy2), original)

    should.not.equal(original.id, copy1.id)
    should.not.equal(original.id, copy2.id)
    should.not.equal(copy1.id, copy2.id)

    let bundle2 = {}
    let copy21 = copy2.fork(bundle2)
    let copy22 = copy2.fork(bundle2)

    should.equal(copy21.id, copy22.id)
    should.equal(copy21, copy22)

    should.equal(Object.getPrototypeOf(copy21), copy2)
  })

  it('nested fork', async(function*() {
    let transformCase = simpleHandlerBuilder(
    config => {
      let { transform } = config
      let doTransform = transform == 'uppercase' ?
        string => string.toUpperCase() :
        string => string.toLowerCase()

      return (args, text) =>
        doTransform(text)
    }, 'text', 'text')

    let filter = transformFilter(transformCase, 'out')

    let filter1 = filter.fork()
    let filter2 = filter.fork()

    should.not.equal(filter1.id, filter2.id)
    should.not.equal(filter1.transformComponent.id, 
      filter2.transformComponent.id)

    let greet = simpleHandler(
      (args, name) =>
        'Hello, ' + name, 
      'text', 'text')

    let greet1 = greet.fork()
      .middleware(filter1)

    let greet2  = greet.fork()
      .middleware(filter1)

    let greet3 = greet.fork()
      .middleware(filter2)

    let config = { transform: 'uppercase' }

    let handler = yield greet1.loadHandler(config)
    
    yield handler({}, 'John')
      .should.eventually.equal('HELLO, JOHN')

    config.transform = 'lowercase'

    handler = yield greet2.loadHandler(config)

    yield handler({}, 'Bob')
      .should.eventually.equal('HELLO, BOB')

    config.transform = 'lowercase'

    handler = yield greet3.loadHandler(config)

    yield handler({}, 'Alice')
      .should.eventually.equal('hello, alice')
  }))

  it('forked middlewares', async(function*() {
    let transformCase = simpleHandlerBuilder(
    config => {
      let { transform } = config
      let doTransform = transform == 'uppercase' ?
        string => string.toUpperCase() :
        string => string.toLowerCase()

      return (args, text) =>
        doTransform(text)
    }, 'text', 'text')

    let filter = transformFilter(transformCase, 'out')

    let greet = simpleHandler(
      (args, name) =>
        'Hello, ' + name, 
      'text', 'text')
    .middleware(filter)

    let forkTable1 = { }
    let forkTable2 = { }

    let greet1 = greet.fork(forkTable1)
    let uppercase = transformCase.fork(forkTable1)

    let greet2 = greet.fork(forkTable2)

    let config = { transform: 'uppercase' }
    
    let handler = yield uppercase.loadHandler(config)
    
    yield handler({}, 'Test')
      .should.eventually.equal('TEST')

    config.transform = 'lowercase'

    handler = yield greet1.loadHandler(config)
    
    yield handler({}, 'Alice')
      .should.eventually.equal('HELLO, ALICE')

    config.transform = 'lowercase'

    handler = yield greet2.loadHandler(config)
    
    yield handler({}, 'Bob')
      .should.eventually.equal('hello, bob')
  }))

  it('map test', async(function*() {
    let debugMiddleware = component => {
      let name = component.name || 'Unnamed Component'
      return configMiddleware(config => {
        if(!config.debugStack) {
          config.debugStack = []
        }

        config.debugStack.push(name)
      })
    }

    let debuggableComponent = (component, mapTable={}) => {
      var mapped = component.map(debuggableComponent, mapTable)
      
      if(mapped.middleware) {
        mapped.middleware(debugMiddleware(component))
      }

      return mapped
    }

    let upperCase = simpleHandlerBuilder(
      config => {
        var { debugStack } = config

        should.equal(debugStack.length, 3)
        debugStack[0].should.equal('Greet Handler')
        debugStack[1].should.equal('UpperCase Filter')
        debugStack[2].should.equal('UpperCase Handler')

        return (args, text) =>
          text.toUpperCase()
      }, 'text', 'text')
      .setName('UpperCase Handler')

    let filter = transformFilter(upperCase, 'out')
      .setName('UpperCase Filter')

    let greet = simpleHandlerBuilder(
      config => {
        var { debugStack } = config

        should.equal(debugStack.length, 2)
        debugStack[0].should.equal('Greet Handler')
        debugStack[1].should.equal('UpperCase Filter')

        return (args, name) =>
          'Hello, ' + name
      }, 'text', 'text')
    .middleware(filter)
    .setName('Greet Handler')

    let debugged = debuggableComponent(greet)

    let config = { }
    let handler = yield debugged.loadHandler(config)
  }))
})