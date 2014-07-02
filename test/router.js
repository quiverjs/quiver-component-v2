import 'traceur'
import { Router, RouteList } from '../lib/router.js'
import { SimpleHandler } from '../lib/simple-handler.js'
import { loadSimpleHandler } from '../lib/util/loader.js'
import { 
  StaticRoute, RegexRoute, ParamRoute 
} from '../lib/route.js'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()

describe.only('router component test', () => {
  it('static route', () => {
    var handler = (args, input) => {
      input.should.equal('hello')
      return 'goodbye'
    }

    var handlerComponent = new SimpleHandler(handler,
      { inType: 'text', outType: 'text' })

    var route = new StaticRoute(handlerComponent, '/foo')

    var router = new Router()
    router.addRoute(route)

    var builder = router.handleableBuilder

    return loadSimpleHandler({}, router, builder,
      { inType: 'text', outType: 'text' })
      .then(handler => {
        var p1 = handler({ path: '/foo' }, 'hello')
          .should.eventually.equal('goodbye')

        var p2 = handler({ path: '/bar' }, 'nothing')
          .should.be.rejected

        return Promise.all([p1, p2])
      })
  })

  it('regex route', () => {
    var handler = (args, input) => {
      input.should.equal('hello')
      return 'goodbye, ' + args.name
    }

    var handlerComponent = new SimpleHandler(handler,
      { inType: 'text', outType: 'text' })

    var route = new RegexRoute(handlerComponent,
      /^\/(\w+)$/, ['name'])

    var router = new Router()
    router.addRoute(route)

    var builder = router.handleableBuilder

    return loadSimpleHandler({}, router, builder,
      { inType: 'text', outType: 'text' })
      .then(handler => 
        handler({ path: '/foo' }, 'hello')
          .should.eventually.equal('goodbye, foo'))
  })

  it('param route', () => {
    var handler = (args, input) => {
      input.should.equal('hello')
      return 'goodbye, ' + args.name
    }

    var handlerComponent = new SimpleHandler(handler,
      { inType: 'text', outType: 'text' })

    var route = new ParamRoute(handlerComponent, '/:name')

    var router = new Router()
    router.addRoute(route)

    var builder = router.handleableBuilder

    return loadSimpleHandler({}, router, builder,
      { inType: 'text', outType: 'text' })
      .then(handler => 
        handler({ path: '/foo' }, 'hello')
          .should.eventually.equal('goodbye, foo'))
  })
})