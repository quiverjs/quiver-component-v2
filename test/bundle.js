import 'traceur'

import {
  simpleHandlerBuilder, 
  transformFilter, handlerBundle
} from '../lib/export.js'

import { async } from 'quiver-promise'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
var should = chai.should()

describe('bundle component test', () => {
  var bundle = handlerBundle(
  config => {
    var count = config.initial || 0

    var getCount = args => ''+count

    var increment = args => ++count

    var decrement = args => --count

    return { getCount, increment, decrement }

  })
  .simpleHandler('getCount', 'void', 'text')
  .simpleHandler('increment', 'void', 'void')
  .simpleHandler('decrement', 'void', 'void')

  var { 
    getCount, increment, decrement 
  } = bundle.handlerComponents

  it('basic test', async(function*() {
    var config = { }

    var getCountHandler = yield getCount.loadHandler(config)
    var incrementHandler = yield increment.loadHandler(config)
    var decrementHandler = yield decrement.loadHandler(config)

    yield getCountHandler({}).should.eventually.equal('0')

    yield incrementHandler({})
    yield getCountHandler({}).should.eventually.equal('1')

    yield incrementHandler({})
    yield getCountHandler({}).should.eventually.equal('2')

    yield decrementHandler({})
    yield getCountHandler({}).should.eventually.equal('1')

    yield decrementHandler({})
    yield getCountHandler({}).should.eventually.equal('0')
  }))

  it('initialize test', async(function*() {
    var config = {
      initial: 2
    }

    var incrementHandler = yield increment.loadHandler(config)

    config.initial = 4
    var getCountHandler = yield getCount.loadHandler(config)

    yield getCountHandler({}).should.eventually.equal('2')
  }))

  it('privatized bundle test', async(function*() {
    var bundle2 = bundle.fork()
      
    var { 
      getCount: getCount2, 
      increment: increment2
    } = bundle2.handlerComponents

    var config = { }

    var getCountHandler = yield getCount.loadHandler(config)
    var incrementHandler = yield increment.loadHandler(config)

    var getCountHandler2 = yield getCount2.loadHandler(config)
    var incrementHandler2 = yield increment2.loadHandler(config)
    
    yield getCountHandler({}).should.eventually.equal('0')
    yield getCountHandler2({}).should.eventually.equal('0')

    yield incrementHandler({})
    yield getCountHandler({}).should.eventually.equal('1')
    yield getCountHandler2({}).should.eventually.equal('0')

    yield incrementHandler({})
    yield getCountHandler({}).should.eventually.equal('2')
    yield getCountHandler2({}).should.eventually.equal('0')

    yield incrementHandler2({})
    yield getCountHandler({}).should.eventually.equal('2')
    yield getCountHandler2({}).should.eventually.equal('1')
  }))

  it('privatized test', async(function*() {
    var forkTable = { }
    
    var getCount2 = getCount.fork(forkTable)
    var increment2 = increment.fork(forkTable)

    var config = { }

    var getCountHandler = yield getCount.loadHandler(config)
    var incrementHandler = yield increment.loadHandler(config)

    var getCountHandler2 = yield getCount2.loadHandler(config)
    var incrementHandler2 = yield increment2.loadHandler(config)
    
    yield getCountHandler({}).should.eventually.equal('0')
    yield getCountHandler2({}).should.eventually.equal('0')

    yield incrementHandler({})
    yield getCountHandler({}).should.eventually.equal('1')
    yield getCountHandler2({}).should.eventually.equal('0')

    yield incrementHandler({})
    yield getCountHandler({}).should.eventually.equal('2')
    yield getCountHandler2({}).should.eventually.equal('0')

    yield incrementHandler2({})
    yield getCountHandler({}).should.eventually.equal('2')
    yield getCountHandler2({}).should.eventually.equal('1')
  }))

  it('privatized middleware test', async(function*() {
    var prefixer = simpleHandlerBuilder(config => {
      var prefix = config.prefix || ''

      return (args, text) => prefix + '-' + text
    }, 'text', 'text')

    var prefixFilter = transformFilter(prefixer, 'out')

    var bundle2 = bundle.fork()
      
    var { 
      getCount: getCount2, 
      increment: increment2
    } = bundle2.handlerComponents

    getCount2.addMiddleware(prefixFilter)

    var bundle3 = bundle2.fork()
      
    var { 
      getCount: getCount3, 
      increment: increment3
    } = bundle3.handlerComponents

    var config = { 
      prefix: 'foo' 
    }

    var getCountHandler2 = yield getCount2.loadHandler(config)
    var incrementHandler2 = yield increment2.loadHandler(config)
    
    config.prefix = 'bar'

    var getCountHandler3 = yield getCount3.loadHandler(config)
    var incrementHandler3 = yield increment3.loadHandler(config)
    
    yield getCountHandler2({}).should.eventually.equal('foo-0')
    yield getCountHandler3({}).should.eventually.equal('bar-0')

    yield incrementHandler2({})
    yield getCountHandler2({}).should.eventually.equal('foo-1')
    yield getCountHandler3({}).should.eventually.equal('bar-0')

    yield incrementHandler2({})
    yield getCountHandler2({}).should.eventually.equal('foo-2')
    yield getCountHandler3({}).should.eventually.equal('bar-0')

    yield incrementHandler3({})
    yield getCountHandler2({}).should.eventually.equal('foo-2')
    yield getCountHandler3({}).should.eventually.equal('bar-1')
  }))
})