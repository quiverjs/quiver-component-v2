import { 
  makeRouter, methodRouter,
  routeList as makeRouteList,
  httpHandler as createHttpHandler,
  simpleHandler, simpleHandlerBuilder,
  simpleHandlerLoader,
  loadHttpHandler,
} from '../lib/export.js'

import {
  streamableToText, textToStreamable,
  emptyStreamable
} from 'quiver-stream-util'

import { 
  RequestHead, ResponseHead,
} from 'quiver-http'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const should = chai.should()

describe('router component test', () => {
  it('static route', async function() {
    const handlerComponent = simpleHandler(
      (args, input) => {
        input.should.equal('hello')
        return 'goodbye'
      }, 'text', 'text')

    const router = makeRouter()
      .staticRoute('/foo', handlerComponent)
      .setLoader(simpleHandlerLoader('text', 'text'))

    const handler = await router.loadHandler({})

    await handler({ path: '/foo' }, 'hello')
      .should.eventually.equal('goodbye')

    await handler({ path: '/bar' }, 'nothing')
      .should.be.rejected
  })

  it('regex route', async function() {
    const greet = simpleHandler(
      (args, input) => {
        input.should.equal('hello')
        args.name.should.equal('john')

        return 'goodbye, ' + args.name
      }, 'text', 'text')

    const router = makeRouter()
      .regexRoute(/^\/greet\/(\w+)$/, ['name'], greet)
      .setLoader(simpleHandlerLoader('text', 'text'))

    const handler = await router.loadHandler({})

    await handler({ path: '/greet/john' }, 'hello')
      .should.eventually.equal('goodbye, john')
  })

  it('param route', async function() {
    const greet = simpleHandler(
      (args, input) => {
        input.should.equal('hello')
        return 'goodbye, ' + args.name
      }, 'text', 'text')

    const router = makeRouter()
      .paramRoute('/greet/:name', greet)
      .setLoader(simpleHandlerLoader('text', 'text'))

    const handler = await router.loadHandler({})

    await handler({ path: '/greet/foo' }, 'hello')
      .should.eventually.equal('goodbye, foo')
  })

  it('route list', async function() {
    const foo = simpleHandlerBuilder(
      config => {
        should.not.exist(config.barModified)
        config.fooModified = true

        return args => {
          args.path.should.equal('/foo')

          return 'foo'
        }
      }, 'void', 'text')

    const bar = simpleHandlerBuilder(
      config => {
        should.not.exist(config.fooModified)
        config.barModified = true

        return args => {
          args.path.should.equal('/subpath')
          args.id.should.equal('baz')

          return 'bar'
        }
      }, 'void', 'text')

    const defaultPage = simpleHandler(
      args => 'default page', 
      'void', 'text')

    const routeList = makeRouteList()
      .staticRoute('/foo', foo)
      .paramRoute('/bar/:id/:restpath', bar)

    const router = makeRouter()
      .routeList(routeList)
      .defaultRoute(defaultPage)
      .setLoader(simpleHandlerLoader('void', 'text'))

    const handler = await router.loadHandler({})

    await handler({ path: '/foo' })
      .should.eventually.equal('foo')

    await handler({ path: '/bar/baz/subpath' })
      .should.eventually.equal('bar')

    await handler({ path: '/baz' })
      .should.eventually.equal('default page')
  })

  it('nested router', async function() {
    const post = simpleHandler(
      (args, input) => {
        args.userId.should.equal('john')
        args.postId.should.equal('welcome-to-my-blog')
        input.should.equal('some comment')

        return 'Hello World!'
      }, 'text', 'text')

    const defaultPage = simpleHandler(
      args => 'default page', 
      'void', 'text')

    const userRouter = makeRouter()
      .paramRoute('/post/:postId', post)

    const mainRouter = makeRouter()
      .paramRoute('/user/:userId/:restpath', userRouter)
      .defaultRoute(defaultPage)
      .setLoader(simpleHandlerLoader('text', 'text'))

    const handler = await mainRouter.loadHandler({})

    const path = '/user/john/post/welcome-to-my-blog'

    await handler({ path }, 'some comment')
      .should.eventually.equal('Hello World!')

    await handler({ path: '/user/john/spam' }, 'spam')
      .should.be.rejected

    await handler({ path: '/other place' }, 'nothing')
      .should.eventually.equal('default page')
  })

  it('http router test', async function() {
    const foo = createHttpHandler(
    async function(requestHead, streamable) {
      requestHead.method.should.equal('GET')
      requestHead.path.should.equal('/foo/john')
      requestHead.args.name.should.equal('john')

      return [new ResponseHead({
        statusCode: 202
      }), textToStreamable('foo')]
    })

    const bar = createHttpHandler(
    async function(requestHead, streamable) {
      requestHead.method.should.equal('POST')
      requestHead.path.should.equal('/bar')

      await streamableToText(streamable)
        .should.eventually.equal('post content')

      return [new ResponseHead({
        statusCode: 401
      }), textToStreamable('Forbidden')]
    })

    const baz = simpleHandler((args, text) => {
      args.path.should.equal('/baz')
      text.should.equal('upload')

      return 'baz'
    }, 'text', 'text')

    const router = makeRouter()
      .paramRoute('/foo/:name', foo)
      .staticRoute('/bar', bar)
      .staticRoute('/baz', baz)

    const {
      streamHandler,
      httpHandler
    } = await router.loadHandleable({})

    const request1 = new RequestHead({ 
      url: '/foo/john?a=b' 
    })

    const [
      response1, streamable1
    ] = await httpHandler(request1, emptyStreamable())

    response1.statusCode.should.equal(202)
    await streamableToText(streamable1)
      .should.eventually.equal('foo')

    const request2 = new RequestHead({
      method: 'POST',
      url: '/bar?a=b'
    })

    const [
      response2, streamable2
    ] = await httpHandler(request2, 
      textToStreamable('post content'))

    response2.statusCode.should.equal(401)
    await streamableToText(streamable2)
      .should.eventually.equal('Forbidden')

    const request3 = new RequestHead({
      method: 'POST',
      url: '/baz?a=b'
    })

    const [
      response3, streamable3
    ] = await httpHandler(request3, 
      textToStreamable('upload'))

    response3.statusCode.should.equal(200)
    await streamableToText(streamable3)
      .should.eventually.equal('baz')


    const request4 = new RequestHead({
      method: 'GET',
      url: '/not-exists'
    })

    await httpHandler(request4, emptyStreamable())
      .should.be.rejected

    await streamHandler({ path: '/baz'}, 
      textToStreamable('upload'))
      .then(streamableToText)
      .should.eventually.equal('baz')

    await streamHandler({ path: '/foo/john' }, 
      emptyStreamable())
      .should.be.rejected

    await streamHandler({ path: '/bar' }, 
      emptyStreamable())
      .should.be.rejected
  })

  it('method router test 1', async function() {
    const foo = simpleHandler(
      args => 'foo',
      'void', 'text')

    const router = methodRouter({
      get: foo
    })
    .setLoader(loadHttpHandler)

    const handler = await router.loadHandler({})

    let [responseHead, responseStreamable] = 
      await handler(new RequestHead({
        method: 'GET'
      }), emptyStreamable())

    responseHead.statusCode.should.equal(200)

    await streamableToText(responseStreamable)
      .should.eventually.equal('foo')

    ;[responseHead, responseStreamable] = 
      await handler(new RequestHead({
        method: 'POST'
      }), emptyStreamable())

    responseHead.statusCode.should.equal(405)
  })

  it('method router test 2', async function() {
    const foo = simpleHandler(
      args => 'foo',
      'void', 'text')

    const bar = simpleHandler(
      args => 'bar',
      'void', 'text')

    const router = makeRouter()
      .staticRoute('/', {
        get: foo,
        post: bar
      })
    .setLoader(loadHttpHandler)

    const handler = await router.loadHandler({})

    let [responseHead, responseStreamable] = 
      await handler(new RequestHead({
        method: 'GET',
        url: '/'
      }), emptyStreamable()) 

    responseHead.statusCode.should.equal(200)

    await streamableToText(responseStreamable)
      .should.eventually.equal('foo')

    ;[responseHead, responseStreamable] = 
      await handler(new RequestHead({
        method: 'POST',
        url: '/'
      }), emptyStreamable()) 

    responseHead.statusCode.should.equal(200)
    
    await streamableToText(responseStreamable)
      .should.eventually.equal('bar')

    ;[responseHead, responseStreamable] = 
      await handler(new RequestHead({
        method: 'HEAD',
        url: '/'
      }), emptyStreamable()) 

    responseHead.statusCode.should.equal(200)

    await streamableToText(responseStreamable)
      .should.eventually.equal('')

    ;[responseHead, responseStreamable] = 
      await handler(new RequestHead({
        method: 'PUT'
      }), emptyStreamable())

    responseHead.statusCode.should.equal(405)

    ;[responseHead, responseStreamable] = 
      await handler(new RequestHead({
        method: 'OPTIONS'
      }), emptyStreamable())

    responseHead.statusCode.should.equal(200)
    responseHead.getHeader('allow').should.equal(
      'GET, POST, HEAD, OPTIONS')
  })
})
