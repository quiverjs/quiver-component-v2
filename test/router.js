import 'traceur'

import { 
  router as createRouter, 
  routeList as createRouteList, 
  simpleHandler, loadSimpleHandler,
} from '../lib/export.js'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()

describe('router component test', () => {
  it('static route', () => {
    var handlerComponent = simpleHandler(
      (args, input) => {
        input.should.equal('hello')
        return 'goodbye'
      }, 'text', 'text')

    var router = createRouter()
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
    var greet = simpleHandler(
      (args, input) => {
        input.should.equal('hello')
        args.name.should.equal('john')

        return 'goodbye, ' + args.name
      }, 'text', 'text')

    var router = createRouter()
      .addRegexRoute(greet, /^\/greet\/(\w+)$/, ['name'])

    return loadSimpleHandler({}, router, 'text', 'text')
      .then(handler => 
        handler({ path: '/greet/john' }, 'hello')
          .should.eventually.equal('goodbye, john'))
  })

  it('param route', () => {
    var greet = simpleHandler(
      (args, input) => {
        input.should.equal('hello')
        return 'goodbye, ' + args.name
      }, 'text', 'text')

    var router = createRouter()
      .addParamRoute(greet, '/greet/:name')

    return loadSimpleHandler({}, router, 'text', 'text')
      .then(handler => 
        handler({ path: '/greet/foo' }, 'hello')
          .should.eventually.equal('goodbye, foo'))
  })

  it('route list', () => {
    var foo = simpleHandler(
      args => {
        args.path.should.equal('/foo')

        return 'foo'
      }, 'void', 'text')

    var bar = simpleHandler(
      args => {
        args.path.should.equal('/subpath')
        args.id.should.equal('baz')

        return 'bar'
      }, 'void', 'text')

    var defaultPage = simpleHandler(
      args => 'default page', 
      'void', 'text')

    var routeList = createRouteList()
      .addStaticRoute(foo, '/foo')
      .addParamRoute(bar,  '/bar/:id/:restpath')

    var router = createRouter()
      .addRouteList(routeList)
      .setDefaultHandler(defaultPage)

    return loadSimpleHandler({}, router, 'void', 'text')
    .then(handler => {
      var p1 = handler({ path: '/foo' })
        .should.eventually.equal('foo')

      var p2 = handler({ path: '/bar/baz/subpath' })
        .should.eventually.equal('bar')

      var p3 = handler({ path: '/baz' })
        .should.eventually.equal('default page')

      return Promise.all([p1, p2, p3])
    })
  })

  it('nested router', () => {
    var post = simpleHandler(
      (args, input) => {
        args.userId.should.equal('john')
        args.postId.should.equal('welcome-to-my-blog')
        input.should.equal('some comment')

        return 'Hello World!'
      }, 'text', 'text')

    var defaultPage = simpleHandler(
      args => 'default page', 
      'void', 'text')

    var userRouter = createRouter()
      .addParamRoute(post, '/post/:postId')

    var mainRouter = createRouter()
      .addParamRoute(userRouter, '/user/:userId/:restpath')
      .setDefaultHandler(defaultPage)

    return loadSimpleHandler({}, mainRouter, 'text', 'text')
    .then(handler => {
      var path = '/user/john/post/welcome-to-my-blog'

      var p1 = handler({ path }, 'some comment')
        .should.eventually.equal('Hello World!')

      var p2 = handler({ path: '/user/john/spam' }, 'spam')
        .should.be.rejected

      var p3 = handler({ path: '/other place' }, 'nothing')
        .should.eventually.equal('default page')

      return Promise.all([p1, p2, p3])
    })
  })
})