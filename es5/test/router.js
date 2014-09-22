"use strict";
var $__traceur_64_0_46_0_46_6__,
    $___46__46__47_lib_47_export_46_js__,
    $__quiver_45_promise__,
    $__quiver_45_stream_45_util__,
    $__quiver_45_http__;
($__traceur_64_0_46_0_46_6__ = require("traceur"), $__traceur_64_0_46_0_46_6__ && $__traceur_64_0_46_0_46_6__.__esModule && $__traceur_64_0_46_0_46_6__ || {default: $__traceur_64_0_46_0_46_6__});
var $__0 = ($___46__46__47_lib_47_export_46_js__ = require("../lib/export.js"), $___46__46__47_lib_47_export_46_js__ && $___46__46__47_lib_47_export_46_js__.__esModule && $___46__46__47_lib_47_export_46_js__ || {default: $___46__46__47_lib_47_export_46_js__}),
    createRouter = $__0.router,
    createRouteList = $__0.routeList,
    createHttpHandler = $__0.httpHandler,
    simpleHandler = $__0.simpleHandler,
    loadSimpleHandler = $__0.loadSimpleHandler;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var $__2 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    streamableToText = $__2.streamableToText,
    textToStreamable = $__2.textToStreamable,
    emptyStreamable = $__2.emptyStreamable;
var $__3 = ($__quiver_45_http__ = require("quiver-http"), $__quiver_45_http__ && $__quiver_45_http__.__esModule && $__quiver_45_http__ || {default: $__quiver_45_http__}),
    RequestHead = $__3.RequestHead,
    ResponseHead = $__3.ResponseHead;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
describe('router component test', (function() {
  it('static route', async($traceurRuntime.initGeneratorFunction(function $__8() {
    var handlerComponent,
        router,
        handler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            handlerComponent = simpleHandler((function(args, input) {
              input.should.equal('hello');
              return 'goodbye';
            }), 'text', 'text');
            router = createRouter().addStaticRoute(handlerComponent, '/foo');
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 2;
            return loadSimpleHandler({}, router, 'text', 'text');
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({path: '/foo'}, 'hello').should.eventually.equal('goodbye');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 10;
            return handler({path: '/bar'}, 'nothing').should.be.rejected;
          case 10:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__8, this);
  })));
  it('regex route', async($traceurRuntime.initGeneratorFunction(function $__9() {
    var greet,
        router,
        handler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            greet = simpleHandler((function(args, input) {
              input.should.equal('hello');
              args.name.should.equal('john');
              return 'goodbye, ' + args.name;
            }), 'text', 'text');
            router = createRouter().addRegexRoute(greet, /^\/greet\/(\w+)$/, ['name']);
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 2;
            return loadSimpleHandler({}, router, 'text', 'text');
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({path: '/greet/john'}, 'hello').should.eventually.equal('goodbye, john');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__9, this);
  })));
  it('param route', async($traceurRuntime.initGeneratorFunction(function $__10() {
    var greet,
        router,
        handler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            greet = simpleHandler((function(args, input) {
              input.should.equal('hello');
              return 'goodbye, ' + args.name;
            }), 'text', 'text');
            router = createRouter().addParamRoute(greet, '/greet/:name');
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 2;
            return loadSimpleHandler({}, router, 'text', 'text');
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({path: '/greet/foo'}, 'hello').should.eventually.equal('goodbye, foo');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__10, this);
  })));
  it('route list', async($traceurRuntime.initGeneratorFunction(function $__11() {
    var foo,
        bar,
        defaultPage,
        routeList,
        router,
        handler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            foo = simpleHandler((function(args) {
              args.path.should.equal('/foo');
              return 'foo';
            }), 'void', 'text');
            bar = simpleHandler((function(args) {
              args.path.should.equal('/subpath');
              args.id.should.equal('baz');
              return 'bar';
            }), 'void', 'text');
            defaultPage = simpleHandler((function(args) {
              return 'default page';
            }), 'void', 'text');
            routeList = createRouteList().addStaticRoute(foo, '/foo').addParamRoute(bar, '/bar/:id/:restpath');
            router = createRouter().addRouteList(routeList).setDefaultHandler(defaultPage);
            $ctx.state = 18;
            break;
          case 18:
            $ctx.state = 2;
            return loadSimpleHandler({}, router, 'void', 'text');
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({path: '/foo'}).should.eventually.equal('foo');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 10;
            return handler({path: '/bar/baz/subpath'}).should.eventually.equal('bar');
          case 10:
            $ctx.maybeThrow();
            $ctx.state = 12;
            break;
          case 12:
            $ctx.state = 14;
            return handler({path: '/baz'}).should.eventually.equal('default page');
          case 14:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__11, this);
  })));
  it('nested router', async($traceurRuntime.initGeneratorFunction(function $__12() {
    var post,
        defaultPage,
        userRouter,
        mainRouter,
        handler,
        path;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            post = simpleHandler((function(args, input) {
              args.userId.should.equal('john');
              args.postId.should.equal('welcome-to-my-blog');
              input.should.equal('some comment');
              return 'Hello World!';
            }), 'text', 'text');
            defaultPage = simpleHandler((function(args) {
              return 'default page';
            }), 'void', 'text');
            userRouter = createRouter().addParamRoute(post, '/post/:postId');
            mainRouter = createRouter().addParamRoute(userRouter, '/user/:userId/:restpath').setDefaultHandler(defaultPage);
            $ctx.state = 18;
            break;
          case 18:
            $ctx.state = 2;
            return loadSimpleHandler({}, mainRouter, 'text', 'text');
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            path = '/user/john/post/welcome-to-my-blog';
            $ctx.state = 20;
            break;
          case 20:
            $ctx.state = 6;
            return handler({path: path}, 'some comment').should.eventually.equal('Hello World!');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 10;
            return handler({path: '/user/john/spam'}, 'spam').should.be.rejected;
          case 10:
            $ctx.maybeThrow();
            $ctx.state = 12;
            break;
          case 12:
            $ctx.state = 14;
            return handler({path: '/other place'}, 'nothing').should.eventually.equal('default page');
          case 14:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__12, this);
  })));
  it('http router test', async($traceurRuntime.initGeneratorFunction(function $__13() {
    var foo,
        bar,
        baz,
        router,
        $__4,
        streamHandler,
        httpHandler,
        request1,
        $__5,
        response1,
        streamable1,
        request2,
        $__6,
        response2,
        streamable2,
        request3,
        $__7,
        response3,
        streamable3,
        request4,
        $__16,
        $__17,
        $__18,
        $__19,
        $__20,
        $__21,
        $__22,
        $__23,
        $__24,
        $__25,
        $__26,
        $__27,
        $__28,
        $__29,
        $__30,
        $__31,
        $__32,
        $__33,
        $__34,
        $__35;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            foo = createHttpHandler(async($traceurRuntime.initGeneratorFunction(function $__14(requestHead, streamable) {
              return $traceurRuntime.createGeneratorInstance(function($ctx) {
                while (true)
                  switch ($ctx.state) {
                    case 0:
                      requestHead.method.should.equal('GET');
                      requestHead.path.should.equal('/foo/john');
                      requestHead.args.name.should.equal('john');
                      $ctx.state = 4;
                      break;
                    case 4:
                      $ctx.returnValue = [new ResponseHead({statusCode: 202}), textToStreamable('foo')];
                      $ctx.state = -2;
                      break;
                    default:
                      return $ctx.end();
                  }
              }, $__14, this);
            })));
            bar = createHttpHandler(async($traceurRuntime.initGeneratorFunction(function $__15(requestHead, streamable) {
              return $traceurRuntime.createGeneratorInstance(function($ctx) {
                while (true)
                  switch ($ctx.state) {
                    case 0:
                      requestHead.method.should.equal('POST');
                      requestHead.path.should.equal('/bar');
                      $ctx.state = 8;
                      break;
                    case 8:
                      $ctx.state = 2;
                      return streamableToText(streamable).should.eventually.equal('post content');
                    case 2:
                      $ctx.maybeThrow();
                      $ctx.state = 4;
                      break;
                    case 4:
                      $ctx.returnValue = [new ResponseHead({statusCode: 401}), textToStreamable('Forbidden')];
                      $ctx.state = -2;
                      break;
                    default:
                      return $ctx.end();
                  }
              }, $__15, this);
            })));
            baz = simpleHandler((function(args, text) {
              args.path.should.equal('/baz');
              text.should.equal('upload');
              return 'baz';
            }), 'text', 'text');
            router = createRouter().addParamRoute(foo, '/foo/:name').addStaticRoute(bar, '/bar').addStaticRoute(baz, '/baz');
            $ctx.state = 62;
            break;
          case 62:
            $__16 = router.loadHandleable;
            $__17 = $__16.call(router, {});
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__17;
          case 2:
            $__18 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__4 = $__18;
            $__19 = $__4.streamHandler;
            streamHandler = $__19;
            $__20 = $__4.httpHandler;
            httpHandler = $__20;
            $ctx.state = 8;
            break;
          case 8:
            request1 = new RequestHead({url: '/foo/john?a=b'});
            $ctx.state = 64;
            break;
          case 64:
            $__21 = emptyStreamable();
            $__22 = httpHandler(request1, $__21);
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 10;
            return $__22;
          case 10:
            $__23 = $ctx.sent;
            $ctx.state = 12;
            break;
          case 12:
            $__5 = $__23;
            $__24 = $__5[0];
            response1 = $__24;
            $__25 = $__5[1];
            streamable1 = $__25;
            $ctx.state = 16;
            break;
          case 16:
            response1.statusCode.should.equal(202);
            $ctx.state = 66;
            break;
          case 66:
            $ctx.state = 18;
            return streamableToText(streamable1).should.eventually.equal('foo');
          case 18:
            $ctx.maybeThrow();
            $ctx.state = 20;
            break;
          case 20:
            request2 = new RequestHead({
              method: 'POST',
              url: '/bar?a=b'
            });
            $ctx.state = 68;
            break;
          case 68:
            $__26 = textToStreamable('post content');
            $__27 = httpHandler(request2, $__26);
            $ctx.state = 26;
            break;
          case 26:
            $ctx.state = 22;
            return $__27;
          case 22:
            $__28 = $ctx.sent;
            $ctx.state = 24;
            break;
          case 24:
            $__6 = $__28;
            $__29 = $__6[0];
            response2 = $__29;
            $__30 = $__6[1];
            streamable2 = $__30;
            $ctx.state = 28;
            break;
          case 28:
            response2.statusCode.should.equal(401);
            $ctx.state = 70;
            break;
          case 70:
            $ctx.state = 30;
            return streamableToText(streamable2).should.eventually.equal('Forbidden');
          case 30:
            $ctx.maybeThrow();
            $ctx.state = 32;
            break;
          case 32:
            request3 = new RequestHead({
              method: 'POST',
              url: '/baz?a=b'
            });
            $ctx.state = 72;
            break;
          case 72:
            $__31 = textToStreamable('upload');
            $__32 = httpHandler(request3, $__31);
            $ctx.state = 38;
            break;
          case 38:
            $ctx.state = 34;
            return $__32;
          case 34:
            $__33 = $ctx.sent;
            $ctx.state = 36;
            break;
          case 36:
            $__7 = $__33;
            $__34 = $__7[0];
            response3 = $__34;
            $__35 = $__7[1];
            streamable3 = $__35;
            $ctx.state = 40;
            break;
          case 40:
            response3.statusCode.should.equal(200);
            $ctx.state = 74;
            break;
          case 74:
            $ctx.state = 42;
            return streamableToText(streamable3).should.eventually.equal('baz');
          case 42:
            $ctx.maybeThrow();
            $ctx.state = 44;
            break;
          case 44:
            request4 = new RequestHead({
              method: 'GET',
              url: '/not-exists'
            });
            $ctx.state = 76;
            break;
          case 76:
            $ctx.state = 46;
            return httpHandler(request4, emptyStreamable()).should.be.rejected;
          case 46:
            $ctx.maybeThrow();
            $ctx.state = 48;
            break;
          case 48:
            $ctx.state = 50;
            return streamHandler({path: '/baz'}, textToStreamable('upload')).then(streamableToText).should.eventually.equal('baz');
          case 50:
            $ctx.maybeThrow();
            $ctx.state = 52;
            break;
          case 52:
            $ctx.state = 54;
            return streamHandler({path: '/foo/john'}, emptyStreamable()).should.be.rejected;
          case 54:
            $ctx.maybeThrow();
            $ctx.state = 56;
            break;
          case 56:
            $ctx.state = 58;
            return streamHandler({path: '/bar'}, emptyStreamable()).should.be.rejected;
          case 58:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__13, this);
  })));
}));
