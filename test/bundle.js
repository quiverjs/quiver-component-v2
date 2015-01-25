import 'traceur'

import {
  simpleHandlerBuilder, 
  transformFilter, handlerBundle
} from '../lib/export.js'

import { async } from 'quiver-promise'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
let should = chai.should()

describe('bundle component test', () => {
  let bundle = handlerBundle(
  config => {
    let count = config.initial || 0

    let getCount = args => ''+count

    let increment = args => ++count

    let decrement = args => --count

    return { getCount, increment, decrement }

  })
  .simpleHandler('getCount', 'void', 'text')
  .simpleHandler('increment', 'void', 'void')
  .simpleHandler('decrement', 'void', 'void')

  let { 
    getCount, increment, decrement 
  } = bundle.toHandlerComponents()

  it('basic test', async(function*() {
    let config = { }

    let getCountHandler = yield getCount.loadHandler(config)
    let incrementHandler = yield increment.loadHandler(config)
    let decrementHandler = yield decrement.loadHandler(config)

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
    let config = {
      initial: 2
    }

    let incrementHandler = yield increment.loadHandler(config)

    config.initial = 4
    let getCountHandler = yield getCount.loadHandler(config)

    yield getCountHandler({}).should.eventually.equal('2')
  }))

  it('privatized bundle test', async(function*() {
    let bundle2 = bundle.fork()
      
    let { 
      getCount: getCount2, 
      increment: increment2
    } = bundle2.toHandlerComponents()

    let config = { }

    let getCountHandler = yield getCount.loadHandler(config)
    let incrementHandler = yield increment.loadHandler(config)

    let getCountHandler2 = yield getCount2.loadHandler(config)
    let incrementHandler2 = yield increment2.loadHandler(config)
    
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
    let forkTable = { }
    
    let getCount2 = getCount.fork(forkTable)
    let increment2 = increment.fork(forkTable)

    let config = { }

    let getCountHandler = yield getCount.loadHandler(config)
    let incrementHandler = yield increment.loadHandler(config)

    let getCountHandler2 = yield getCount2.loadHandler(config)
    let incrementHandler2 = yield increment2.loadHandler(config)
    
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
    let prefixer = simpleHandlerBuilder(config => {
      let prefix = config.prefix || ''

      return (args, text) => prefix + '-' + text
    }, 'text', 'text')

    let prefixFilter = transformFilter(prefixer, 'out')

    let bundle2 = bundle.fork()
      
    let { 
      getCount: getCount2, 
      increment: increment2
    } = bundle2.toHandlerComponents()

    getCount2.addMiddleware(prefixFilter)

    let bundle3 = bundle2.fork()
      
    let { 
      getCount: getCount3, 
      increment: increment3
    } = bundle3.toHandlerComponents()

    let config = { 
      prefix: 'foo' 
    }

    let getCountHandler2 = yield getCount2.loadHandler(config)
    let incrementHandler2 = yield increment2.loadHandler(config)
    
    config.prefix = 'bar'

    let getCountHandler3 = yield getCount3.loadHandler(config)
    let incrementHandler3 = yield increment3.loadHandler(config)
    
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