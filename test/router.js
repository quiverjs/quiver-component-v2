import 'traceur'

import { 
  Router, RouteList, 
  SimpleHandler, loadSimpleHandler,
  StaticRoute, RegexRoute, ParamRoute 
} from '../lib/export.js'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()

describe('router component test', () => {
  it('static route', () => {
    var handlerComponent = new SimpleHandler(
      (args, input) => {
        input.should.equal('hello')
        return 'goodbye'
      }, 'text', 'text')

    var router = new Router()
      .addStaticRoute(handlerComponent, '/foo')

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
    var handlerComponent = new SimpleHandler(
      (args, input) => {
        input.should.equal('hello')
        return 'goodbye, ' + args.name
      }, 'text', 'text')

    var router = new Router()
      .addRegexRoute(handlerComponent, /^\/(\w+)$/, ['name'])

    return loadSimpleHandler({}, router, 'text', 'text')
      .then(handler => 
        handler({ path: '/foo' }, 'hello')
          .should.eventually.equal('goodbye, foo'))
  })

  it('param route', () => {
    var handlerComponent = new SimpleHandler(
      (args, input) => {
        input.should.equal('hello')
        return 'goodbye, ' + args.name
      }, 'text', 'text')

    var router = new Router()
      .addParamRoute(handlerComponent, '/:name')

    return loadSimpleHandler({}, router, 'text', 'text')
      .then(handler => 
        handler({ path: '/foo' }, 'hello')
          .should.eventually.equal('goodbye, foo'))
  })

  it('route list', () => {
    var fooComponent = new SimpleHandler(
      args => {
        args.path.should.equal('/foo')
        return 'foo'
      }, 'void', 'text')

    var barHandler = args => {
      args.path.should.equal('/subpath')
      args.id.should.equal('baz')

      return 'bar'
    }

    var barComponent = new SimpleHandler(barHandler, 'void', 'text')

    var defaultHandler = args => 'default route'
    var defaultComponent = new SimpleHandler(defaultHandler, 'void', 'text')

    var routeList = new RouteList()
      .addStaticRoute(fooComponent, '/foo')
      .addParamRoute(barComponent,  '/bar/:id/:restpath')

    var router = new Router()
      .addRouteList(routeList)
      .setDefaultHandler(defaultComponent)

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
    var postComponent = new SimpleHandler(
      (args, input) => {
        args.userId.should.equal('john')
        args.postId.should.equal('welcome-to-my-blog')
        input.should.equal('some comment')

        return 'Hello World!'
      }, 'text', 'text')

    var userRouter = new Router()
      .addParamRoute(postComponent, '/post/:postId')

    var defaultComponent = new SimpleHandler(
      args => 'default route', 
      'void', 'text')

    var mainRouter = new Router()
      .addParamRoute(userRouter, '/user/:userId/:restpath')
      .setDefaultHandler(defaultComponent)

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