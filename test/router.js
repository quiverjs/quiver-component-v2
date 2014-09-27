import 'traceur'

import { 
  router as createRouter, 
  routeList as createRouteList, 
  httpHandler as createHttpHandler,
  simpleHandler, simpleHandlerBuilder,
  loadSimpleHandler,
} from '../lib/export.js'

import { async } from 'quiver-promise'

import {
  streamableToText, textToStreamable,
  emptyStreamable
} from 'quiver-stream-util'

import { 
  RequestHead, ResponseHead,
} from 'quiver-http'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()

describe('router component test', () => {
  it('static route', async(function*() {
    var handlerComponent = simpleHandler(
      (args, input) => {
        input.should.equal('hello')
        return 'goodbye'
      }, 'text', 'text')

    var router = createRouter()
      .addStaticRoute(handlerComponent, '/foo')

    var handler = yield loadSimpleHandler(
      {}, router, 'text', 'text')

    yield handler({ path: '/foo' }, 'hello')
      .should.eventually.equal('goodbye')

    yield handler({ path: '/bar' }, 'nothing')
      .should.be.rejected
  }))

  it('regex route', async(function*() {
    var greet = simpleHandler(
      (args, input) => {
        input.should.equal('hello')
        args.name.should.equal('john')

        return 'goodbye, ' + args.name
      }, 'text', 'text')

    var router = createRouter()
      .addRegexRoute(greet, /^\/greet\/(\w+)$/, ['name'])

    var handler = yield loadSimpleHandler(
      {}, router, 'text', 'text')

    yield handler({ path: '/greet/john' }, 'hello')
      .should.eventually.equal('goodbye, john')
  }))

  it('param route', async(function*() {
    var greet = simpleHandler(
      (args, input) => {
        input.should.equal('hello')
        return 'goodbye, ' + args.name
      }, 'text', 'text')

    var router = createRouter()
      .addParamRoute(greet, '/greet/:name')

    var handler = yield loadSimpleHandler(
      {}, router, 'text', 'text')

    yield handler({ path: '/greet/foo' }, 'hello')
      .should.eventually.equal('goodbye, foo')
  }))

  it('route list', async(function*() {
    var foo = simpleHandlerBuilder(
      config => {
        should.not.exist(config.barModified)
        config.fooModified = true

        return args => {
          args.path.should.equal('/foo')

          return 'foo'
        }
      }, 'void', 'text')

    var bar = simpleHandlerBuilder(
      config => {
        should.not.exist(config.fooModified)
        config.barModified = true

        return args => {
          args.path.should.equal('/subpath')
          args.id.should.equal('baz')

          return 'bar'
        }
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

    var handler = yield loadSimpleHandler(
      {}, router, 'void', 'text')

    yield handler({ path: '/foo' })
      .should.eventually.equal('foo')

    yield handler({ path: '/bar/baz/subpath' })
      .should.eventually.equal('bar')

    yield handler({ path: '/baz' })
      .should.eventually.equal('default page')
  }))

  it('nested router', async(function*() {
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

    var handler = yield loadSimpleHandler(
      {}, mainRouter, 'text', 'text')

    var path = '/user/john/post/welcome-to-my-blog'

    yield handler({ path }, 'some comment')
      .should.eventually.equal('Hello World!')

    yield handler({ path: '/user/john/spam' }, 'spam')
      .should.be.rejected

    yield handler({ path: '/other place' }, 'nothing')
      .should.eventually.equal('default page')
  }))

  it('http router test', async(function*() {
    var foo = createHttpHandler(async(
    function*(requestHead, streamable) {
      requestHead.method.should.equal('GET')
      requestHead.path.should.equal('/foo/john')
      requestHead.args.name.should.equal('john')

      return [new ResponseHead({
        statusCode: 202
      }), textToStreamable('foo')]
    }))

    var bar = createHttpHandler(async(
    function*(requestHead, streamable) {
      requestHead.method.should.equal('POST')
      requestHead.path.should.equal('/bar')

      yield streamableToText(streamable)
        .should.eventually.equal('post content')

      return [new ResponseHead({
        statusCode: 401
      }), textToStreamable('Forbidden')]
    }))

    var baz = simpleHandler((args, text) => {
      args.path.should.equal('/baz')
      text.should.equal('upload')

      return 'baz'
    }, 'text', 'text')

    var router = createRouter()
      .addParamRoute(foo, '/foo/:name')
      .addStaticRoute(bar, '/bar')
      .addStaticRoute(baz, '/baz')

    var {
      streamHandler,
      httpHandler
    } = yield router.loadHandleable({})

    var request1 = new RequestHead({ 
      url: '/foo/john?a=b' 
    })

    var [
      response1, streamable1
    ] = yield httpHandler(request1, emptyStreamable())

    response1.statusCode.should.equal(202)
    yield streamableToText(streamable1)
      .should.eventually.equal('foo')

    var request2 = new RequestHead({
      method: 'POST',
      url: '/bar?a=b'
    })

    var [
      response2, streamable2
    ] = yield httpHandler(request2, 
      textToStreamable('post content'))

    response2.statusCode.should.equal(401)
    yield streamableToText(streamable2)
      .should.eventually.equal('Forbidden')

    var request3 = new RequestHead({
      method: 'POST',
      url: '/baz?a=b'
    })

    var [
      response3, streamable3
    ] = yield httpHandler(request3, 
      textToStreamable('upload'))

    response3.statusCode.should.equal(200)
    yield streamableToText(streamable3)
      .should.eventually.equal('baz')


    var request4 = new RequestHead({
      method: 'GET',
      url: '/not-exists'
    })

    yield httpHandler(request4, emptyStreamable())
      .should.be.rejected

    yield streamHandler({ path: '/baz'}, 
      textToStreamable('upload'))
      .then(streamableToText)
      .should.eventually.equal('baz')

    yield streamHandler({ path: '/foo/john' }, 
      emptyStreamable())
      .should.be.rejected

    yield streamHandler({ path: '/bar' }, 
      emptyStreamable())
      .should.be.rejected
  }))
})