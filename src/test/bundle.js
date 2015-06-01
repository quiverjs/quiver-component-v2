import {
  simpleHandlerBuilder, 
  transformFilter, handlerBundle
} from '../lib/export.js'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const should = chai.should()

describe('bundle component test', () => {
  const bundle = handlerBundle(
  config => {
    let count = config.initial || 0

    const getCount = args => ''+count

    const increment = args => ++count

    const decrement = args => --count

    return { getCount, increment, decrement }
  })
  .simpleHandler('getCount', 'void', 'text')
  .simpleHandler('increment', 'void', 'void')
  .simpleHandler('decrement', 'void', 'void')

  const { 
    getCount, increment, decrement 
  } = bundle.toHandlerComponents()

  it('basic test', async function() {
    const config = { }

    const getCountHandler = await getCount.loadHandler(config)
    const incrementHandler = await increment.loadHandler(config)
    const decrementHandler = await decrement.loadHandler(config)

    await getCountHandler({}).should.eventually.equal('0')

    await incrementHandler({})
    await getCountHandler({}).should.eventually.equal('1')

    await incrementHandler({})
    await getCountHandler({}).should.eventually.equal('2')

    await decrementHandler({})
    await getCountHandler({}).should.eventually.equal('1')

    await decrementHandler({})
    await getCountHandler({}).should.eventually.equal('0')
  })

  it('initialize test', async function() {
    const config = {
      initial: 2
    }

    const incrementHandler = await increment.loadHandler(config)

    config.initial = 4
    const getCountHandler = await getCount.loadHandler(config)

    await getCountHandler({}).should.eventually.equal('2')
  })

  it('bundle fork test', async function() {
    const bundle2 = bundle.fork()
      
    const { 
      getCount: getCount2, 
      increment: increment2
    } = bundle2.toHandlerComponents()

    const config = { }

    const getCountHandler = await getCount.loadHandler(config)
    const incrementHandler = await increment.loadHandler(config)

    const getCountHandler2 = await getCount2.loadHandler(config)
    const incrementHandler2 = await increment2.loadHandler(config)
    
    await getCountHandler({}).should.eventually.equal('0')
    await getCountHandler2({}).should.eventually.equal('0')

    await incrementHandler({})
    await getCountHandler({}).should.eventually.equal('1')
    await getCountHandler2({}).should.eventually.equal('0')

    await incrementHandler({})
    await getCountHandler({}).should.eventually.equal('2')
    await getCountHandler2({}).should.eventually.equal('0')

    await incrementHandler2({})
    await getCountHandler({}).should.eventually.equal('2')
    await getCountHandler2({}).should.eventually.equal('1')
  })

  it('privatized test', async function() {
    const forkTable = { }
    
    const getCount2 = getCount.fork(forkTable)
    const increment2 = increment.fork(forkTable)

    const config = { }

    const getCountHandler = await getCount.loadHandler(config)
    const incrementHandler = await increment.loadHandler(config)

    const getCountHandler2 = await getCount2.loadHandler(config)
    const incrementHandler2 = await increment2.loadHandler(config)
    
    await getCountHandler({}).should.eventually.equal('0')
    await getCountHandler2({}).should.eventually.equal('0')

    await incrementHandler({})
    await getCountHandler({}).should.eventually.equal('1')
    await getCountHandler2({}).should.eventually.equal('0')

    await incrementHandler({})
    await getCountHandler({}).should.eventually.equal('2')
    await getCountHandler2({}).should.eventually.equal('0')

    await incrementHandler2({})
    await getCountHandler({}).should.eventually.equal('2')
    await getCountHandler2({}).should.eventually.equal('1')
  })

  it('forked middleware test', async function() {
    const prefixer = simpleHandlerBuilder(config => {
      const prefix = config.prefix || ''

      return (args, text) => prefix + '-' + text
    }, 'text', 'text')

    const prefixFilter = transformFilter(prefixer, 'out')

    const bundle2 = bundle.fork()
      
    const { 
      getCount: getCount2, 
      increment: increment2
    } = bundle2.toHandlerComponents()

    getCount2.addMiddleware(prefixFilter)

    const forkTable = {}
    const getCount3 = getCount2.fork(forkTable)
    const increment3 = increment2.fork(forkTable)

    const config = { 
      prefix: 'foo'
    }

    const getCountHandler2 = await getCount2.loadHandler(config)
    const incrementHandler2 = await increment2.loadHandler(config)
    
    config.prefix = 'bar'

    const getCountHandler3 = await getCount3.loadHandler(config)
    const incrementHandler3 = await increment3.loadHandler(config)
    
    await getCountHandler2({}).should.eventually.equal('foo-0')
    await getCountHandler3({}).should.eventually.equal('bar-0')

    await incrementHandler2({})
    await getCountHandler2({}).should.eventually.equal('foo-1')
    await getCountHandler3({}).should.eventually.equal('bar-0')

    await incrementHandler2({})
    await getCountHandler2({}).should.eventually.equal('foo-2')
    await getCountHandler3({}).should.eventually.equal('bar-0')

    await incrementHandler3({})
    await getCountHandler2({}).should.eventually.equal('foo-2')
    await getCountHandler3({}).should.eventually.equal('bar-1')
  })
})
