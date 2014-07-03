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

describe('router component test', () => {
  it('static route', () => {
    var handler = (args, input) => {
      input.should.equal('hello')
      return 'goodbye'
    }

    var handlerComponent = new SimpleHandler(handler, 'text', 'text')

    var route = new StaticRoute(handlerComponent, '/foo')

    var router = new Router()
    router.addRoute(route)

    return loadSimpleHandler({}, router, 'text', 'text')
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

    var handlerComponent = new SimpleHandler(handler, 'text', 'text')

    var route = new RegexRoute(handlerComponent,
      /^\/(\w+)$/, ['name'])

    var router = new Router()
    router.addRoute(route)

    return loadSimpleHandler({}, router, 'text', 'text')
      .then(handler => 
        handler({ path: '/foo' }, 'hello')
          .should.eventually.equal('goodbye, foo'))
  })

  it('param route', () => {
    var handler = (args, input) => {
      input.should.equal('hello')
      return 'goodbye, ' + args.name
    }

    var handlerComponent = new SimpleHandler(handler, 'text', 'text')

    var route = new ParamRoute(handlerComponent, '/:name')

    var router = new Router()
    router.addRoute(route)

    return loadSimpleHandler({}, router, 'text', 'text')
      .then(handler => 
        handler({ path: '/foo' }, 'hello')
          .should.eventually.equal('goodbye, foo'))
  })

  it('route list', () => {
    var fooHandler = args => {
      args.path.should.equal('/foo')
      return 'foo'
    }

    var fooComponent = new SimpleHandler(fooHandler, 'void', 'text')
    var fooRoute = new StaticRoute(fooComponent, '/foo')

    var barHandler = args => {
      args.path.should.equal('/subpath')
      args.id.should.equal('baz')

      return 'bar'
    }

    var barComponent = new SimpleHandler(barHandler, 'void', 'text')
    var barRoute = new ParamRoute(barComponent,  '/bar/:id/:restpath')

    var defaultHandler = args => 'default route'
    var defaultComponent = new SimpleHandler(defaultHandler, 'void', 'text')

    var routeList = new RouteList([fooRoute, barRoute])
    var router = new Router([routeList])
    router.setDefaultHandler(defaultComponent)

    return loadSimpleHandler({}, router, 'void', 'text')
    .then(handler => {
      var p1 = handler({ path: '/foo' })
        .should.eventually.equal('foo')

      var p2 = handler({ path: '/bar/baz/subpath' })
        .should.eventually.equal('bar')

      var p3 = handler({ path: '/baz' })
        .should.eventually.equal('default route')

      return Promise.all([p1, p2, p3])
    })
  })

  it('nested router', () => {
    var postHandler = (args, input) => {
      args.userId.should.equal('john')
      args.postId.should.equal('welcome-to-my-blog')
      input.should.equal('some comment')

      return 'Hello World!'
    }

    var postComponent = new SimpleHandler(postHandler, 'text', 'text')
    var postRoute = new ParamRoute(postComponent, '/post/:postId')

    var userRouter = new Router()
    userRouter.addRoute(postRoute)

    var userRoute = new ParamRoute(userRouter, '/user/:userId/:restpath')

    var defaultHandler = args => 'default route'
    var defaultComponent = new SimpleHandler(defaultHandler, 'void', 'text')

    var mainRouter = new Router()
    mainRouter.addRoute(userRoute)
    mainRouter.setDefaultHandler(defaultComponent)

    return loadSimpleHandler({}, mainRouter, 'text', 'text')
    .then(handler => {
      var path = '/user/john/post/welcome-to-my-blog'

      var p1 = handler({ path }, 'some comment')
        .should.eventually.equal('Hello World!')

      var p2 = handler({ path: '/user/john/spam' }, 'spam')
        .should.be.rejected

      var p3 = handler({ path: '/other place' }, 'nothing')
        .should.eventually.equal('default route')

      return Promise.all([p1, p2, p3])
    })
  })
})