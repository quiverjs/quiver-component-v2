"use strict";
var $__traceur_64_0_46_0_46_8__,
    $___46__46__47_lib_47_export_46_js__,
    $__quiver_45_promise__,
    $__quiver_45_stream_45_util__,
    $__quiver_45_http__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_8__ = require("traceur"), $__traceur_64_0_46_0_46_8__ && $__traceur_64_0_46_0_46_8__.__esModule && $__traceur_64_0_46_0_46_8__ || {default: $__traceur_64_0_46_0_46_8__});
var $__0 = ($___46__46__47_lib_47_export_46_js__ = require("../lib/export.js"), $___46__46__47_lib_47_export_46_js__ && $___46__46__47_lib_47_export_46_js__.__esModule && $___46__46__47_lib_47_export_46_js__ || {default: $___46__46__47_lib_47_export_46_js__}),
    makeRouter = $__0.makeRouter,
    methodRouter = $__0.methodRouter,
    makeRouteList = $__0.routeList,
    createHttpHandler = $__0.httpHandler,
    simpleHandler = $__0.simpleHandler,
    simpleHandlerBuilder = $__0.simpleHandlerBuilder,
    simpleHandlerLoader = $__0.simpleHandlerLoader,
    loadHttpHandler = $__0.loadHttpHandler;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var $__2 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    streamableToText = $__2.streamableToText,
    textToStreamable = $__2.textToStreamable,
    emptyStreamable = $__2.emptyStreamable;
var $__3 = ($__quiver_45_http__ = require("quiver-http"), $__quiver_45_http__ && $__quiver_45_http__.__esModule && $__quiver_45_http__ || {default: $__quiver_45_http__}),
    RequestHead = $__3.RequestHead,
    ResponseHead = $__3.ResponseHead;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
let should = chai.should();
describe('router component test', (function() {
  it('static route', async(function*() {
    let handlerComponent = simpleHandler((function(args, input) {
      input.should.equal('hello');
      return 'goodbye';
    }), 'text', 'text');
    let router = makeRouter().staticRoute('/foo', handlerComponent).setLoader(simpleHandlerLoader('text', 'text'));
    let handler = yield router.loadHandler({});
    yield handler({path: '/foo'}, 'hello').should.eventually.equal('goodbye');
    yield handler({path: '/bar'}, 'nothing').should.be.rejected;
  }));
  it('regex route', async(function*() {
    let greet = simpleHandler((function(args, input) {
      input.should.equal('hello');
      args.name.should.equal('john');
      return 'goodbye, ' + args.name;
    }), 'text', 'text');
    let router = makeRouter().regexRoute(/^\/greet\/(\w+)$/, ['name'], greet).setLoader(simpleHandlerLoader('text', 'text'));
    let handler = yield router.loadHandler({});
    yield handler({path: '/greet/john'}, 'hello').should.eventually.equal('goodbye, john');
  }));
  it('param route', async(function*() {
    let greet = simpleHandler((function(args, input) {
      input.should.equal('hello');
      return 'goodbye, ' + args.name;
    }), 'text', 'text');
    let router = makeRouter().paramRoute('/greet/:name', greet).setLoader(simpleHandlerLoader('text', 'text'));
    let handler = yield router.loadHandler({});
    yield handler({path: '/greet/foo'}, 'hello').should.eventually.equal('goodbye, foo');
  }));
  it('route list', async(function*() {
    let foo = simpleHandlerBuilder((function(config) {
      should.not.exist(config.barModified);
      config.fooModified = true;
      return (function(args) {
        args.path.should.equal('/foo');
        return 'foo';
      });
    }), 'void', 'text');
    let bar = simpleHandlerBuilder((function(config) {
      should.not.exist(config.fooModified);
      config.barModified = true;
      return (function(args) {
        args.path.should.equal('/subpath');
        args.id.should.equal('baz');
        return 'bar';
      });
    }), 'void', 'text');
    let defaultPage = simpleHandler((function(args) {
      return 'default page';
    }), 'void', 'text');
    let routeList = makeRouteList().staticRoute('/foo', foo).paramRoute('/bar/:id/:restpath', bar);
    let router = makeRouter().routeList(routeList).defaultRoute(defaultPage).setLoader(simpleHandlerLoader('void', 'text'));
    let handler = yield router.loadHandler({});
    yield handler({path: '/foo'}).should.eventually.equal('foo');
    yield handler({path: '/bar/baz/subpath'}).should.eventually.equal('bar');
    yield handler({path: '/baz'}).should.eventually.equal('default page');
  }));
  it('nested router', async(function*() {
    let post = simpleHandler((function(args, input) {
      args.userId.should.equal('john');
      args.postId.should.equal('welcome-to-my-blog');
      input.should.equal('some comment');
      return 'Hello World!';
    }), 'text', 'text');
    let defaultPage = simpleHandler((function(args) {
      return 'default page';
    }), 'void', 'text');
    let userRouter = makeRouter().paramRoute('/post/:postId', post);
    let mainRouter = makeRouter().paramRoute('/user/:userId/:restpath', userRouter).defaultRoute(defaultPage).setLoader(simpleHandlerLoader('text', 'text'));
    let handler = yield mainRouter.loadHandler({});
    let path = '/user/john/post/welcome-to-my-blog';
    yield handler({path: path}, 'some comment').should.eventually.equal('Hello World!');
    yield handler({path: '/user/john/spam'}, 'spam').should.be.rejected;
    yield handler({path: '/other place'}, 'nothing').should.eventually.equal('default page');
  }));
  it('http router test', async(function*() {
    var $__8,
        $__9,
        $__11,
        $__12,
        $__14,
        $__15;
    let foo = createHttpHandler(async(function*(requestHead, streamable) {
      requestHead.method.should.equal('GET');
      requestHead.path.should.equal('/foo/john');
      requestHead.args.name.should.equal('john');
      return [new ResponseHead({statusCode: 202}), textToStreamable('foo')];
    }));
    let bar = createHttpHandler(async(function*(requestHead, streamable) {
      requestHead.method.should.equal('POST');
      requestHead.path.should.equal('/bar');
      yield streamableToText(streamable).should.eventually.equal('post content');
      return [new ResponseHead({statusCode: 401}), textToStreamable('Forbidden')];
    }));
    let baz = simpleHandler((function(args, text) {
      args.path.should.equal('/baz');
      text.should.equal('upload');
      return 'baz';
    }), 'text', 'text');
    let router = makeRouter().paramRoute('/foo/:name', foo).staticRoute('/bar', bar).staticRoute('/baz', baz);
    let $__6 = yield router.loadHandleable({}),
        streamHandler = $__6.streamHandler,
        httpHandler = $__6.httpHandler;
    let request1 = new RequestHead({url: '/foo/john?a=b'});
    let $__7 = yield httpHandler(request1, emptyStreamable()),
        response1 = ($__8 = $__7[$traceurRuntime.toProperty(Symbol.iterator)](), ($__9 = $__8.next()).done ? void 0 : $__9.value),
        streamable1 = ($__9 = $__8.next()).done ? void 0 : $__9.value;
    response1.statusCode.should.equal(202);
    yield streamableToText(streamable1).should.eventually.equal('foo');
    let request2 = new RequestHead({
      method: 'POST',
      url: '/bar?a=b'
    });
    let $__10 = yield httpHandler(request2, textToStreamable('post content')),
        response2 = ($__11 = $__10[$traceurRuntime.toProperty(Symbol.iterator)](), ($__12 = $__11.next()).done ? void 0 : $__12.value),
        streamable2 = ($__12 = $__11.next()).done ? void 0 : $__12.value;
    response2.statusCode.should.equal(401);
    yield streamableToText(streamable2).should.eventually.equal('Forbidden');
    let request3 = new RequestHead({
      method: 'POST',
      url: '/baz?a=b'
    });
    let $__13 = yield httpHandler(request3, textToStreamable('upload')),
        response3 = ($__14 = $__13[$traceurRuntime.toProperty(Symbol.iterator)](), ($__15 = $__14.next()).done ? void 0 : $__15.value),
        streamable3 = ($__15 = $__14.next()).done ? void 0 : $__15.value;
    response3.statusCode.should.equal(200);
    yield streamableToText(streamable3).should.eventually.equal('baz');
    let request4 = new RequestHead({
      method: 'GET',
      url: '/not-exists'
    });
    yield httpHandler(request4, emptyStreamable()).should.be.rejected;
    yield streamHandler({path: '/baz'}, textToStreamable('upload')).then(streamableToText).should.eventually.equal('baz');
    yield streamHandler({path: '/foo/john'}, emptyStreamable()).should.be.rejected;
    yield streamHandler({path: '/bar'}, emptyStreamable()).should.be.rejected;
  }));
  it('method router test 1', async(function*() {
    var $__7,
        $__10,
        $__8,
        $__9;
    let foo = simpleHandler((function(args) {
      return 'foo';
    }), 'void', 'text');
    let router = methodRouter({get: foo}).setLoader(loadHttpHandler);
    let handler = yield router.loadHandler({});
    var $__6 = yield handler(new RequestHead({method: 'GET'}), emptyStreamable()),
        responseHead = ($__7 = $__6[$traceurRuntime.toProperty(Symbol.iterator)](), ($__10 = $__7.next()).done ? void 0 : $__10.value),
        responseStreamable = ($__10 = $__7.next()).done ? void 0 : $__10.value;
    responseHead.statusCode.should.equal(200);
    yield streamableToText(responseStreamable).should.eventually.equal('foo');
    var $__13 = yield handler(new RequestHead({method: 'POST'}), emptyStreamable()),
        responseHead = ($__8 = $__13[$traceurRuntime.toProperty(Symbol.iterator)](), ($__9 = $__8.next()).done ? void 0 : $__9.value),
        responseStreamable = ($__9 = $__8.next()).done ? void 0 : $__9.value;
    responseHead.statusCode.should.equal(405);
  }));
  it('method router test 2', async(function*() {
    var $__13,
        $__7,
        $__8,
        $__9,
        $__12,
        $__14,
        $__16,
        $__17,
        $__19,
        $__20;
    let foo = simpleHandler((function(args) {
      return 'foo';
    }), 'void', 'text');
    let bar = simpleHandler((function(args) {
      return 'bar';
    }), 'void', 'text');
    let router = makeRouter().staticRoute('/', {
      get: foo,
      post: bar
    }).setLoader(loadHttpHandler);
    let handler = yield router.loadHandler({});
    var $__6 = yield handler(new RequestHead({
      method: 'GET',
      url: '/'
    }), emptyStreamable()),
        responseHead = ($__13 = $__6[$traceurRuntime.toProperty(Symbol.iterator)](), ($__7 = $__13.next()).done ? void 0 : $__7.value),
        responseStreamable = ($__7 = $__13.next()).done ? void 0 : $__7.value;
    responseHead.statusCode.should.equal(200);
    yield streamableToText(responseStreamable).should.eventually.equal('foo');
    var $__10 = yield handler(new RequestHead({
      method: 'POST',
      url: '/'
    }), emptyStreamable()),
        responseHead = ($__8 = $__10[$traceurRuntime.toProperty(Symbol.iterator)](), ($__9 = $__8.next()).done ? void 0 : $__9.value),
        responseStreamable = ($__9 = $__8.next()).done ? void 0 : $__9.value;
    responseHead.statusCode.should.equal(200);
    yield streamableToText(responseStreamable).should.eventually.equal('bar');
    var $__11 = yield handler(new RequestHead({
      method: 'HEAD',
      url: '/'
    }), emptyStreamable()),
        responseHead = ($__12 = $__11[$traceurRuntime.toProperty(Symbol.iterator)](), ($__14 = $__12.next()).done ? void 0 : $__14.value),
        responseStreamable = ($__14 = $__12.next()).done ? void 0 : $__14.value;
    responseHead.statusCode.should.equal(200);
    yield streamableToText(responseStreamable).should.eventually.equal('');
    var $__15 = yield handler(new RequestHead({method: 'PUT'}), emptyStreamable()),
        responseHead = ($__16 = $__15[$traceurRuntime.toProperty(Symbol.iterator)](), ($__17 = $__16.next()).done ? void 0 : $__17.value),
        responseStreamable = ($__17 = $__16.next()).done ? void 0 : $__17.value;
    responseHead.statusCode.should.equal(405);
    var $__18 = yield handler(new RequestHead({method: 'OPTIONS'}), emptyStreamable()),
        responseHead = ($__19 = $__18[$traceurRuntime.toProperty(Symbol.iterator)](), ($__20 = $__19.next()).done ? void 0 : $__20.value),
        responseStreamable = ($__20 = $__19.next()).done ? void 0 : $__20.value;
    responseHead.statusCode.should.equal(200);
    responseHead.getHeader('allow').should.equal('GET, POST, HEAD, OPTIONS');
  }));
}));
