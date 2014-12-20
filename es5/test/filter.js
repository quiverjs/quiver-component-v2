"use strict";
var $__traceur_64_0_46_0_46_7__,
    $__quiver_45_promise__,
    $__quiver_45_simple_45_handler__,
    $__quiver_45_stream_45_util__,
    $__quiver_45_http__,
    $___46__46__47_lib_47_export_46_js__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_7__ = require("traceur"), $__traceur_64_0_46_0_46_7__ && $__traceur_64_0_46_0_46_7__.__esModule && $__traceur_64_0_46_0_46_7__ || {default: $__traceur_64_0_46_0_46_7__});
var $__0 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    async = $__0.async,
    resolve = $__0.resolve,
    reject = $__0.reject;
var streamToSimpleHandler = ($__quiver_45_simple_45_handler__ = require("quiver-simple-handler"), $__quiver_45_simple_45_handler__ && $__quiver_45_simple_45_handler__.__esModule && $__quiver_45_simple_45_handler__ || {default: $__quiver_45_simple_45_handler__}).streamToSimpleHandler;
var $__2 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    streamableToText = $__2.streamableToText,
    textToStreamable = $__2.textToStreamable,
    emptyStreamable = $__2.emptyStreamable,
    jsonToStreamable = $__2.jsonToStreamable;
var RequestHead = ($__quiver_45_http__ = require("quiver-http"), $__quiver_45_http__ && $__quiver_45_http__.__esModule && $__quiver_45_http__ || {default: $__quiver_45_http__}).RequestHead;
var $__4 = ($___46__46__47_lib_47_export_46_js__ = require("../lib/export.js"), $___46__46__47_lib_47_export_46_js__ && $___46__46__47_lib_47_export_46_js__.__esModule && $___46__46__47_lib_47_export_46_js__ || {default: $___46__46__47_lib_47_export_46_js__}),
    simpleHandler = $__4.simpleHandler,
    simpleHandlerBuilder = $__4.simpleHandlerBuilder,
    makeHandleable = $__4.handleable,
    streamFilter = $__4.streamFilter,
    httpFilter = $__4.httpFilter,
    transformFilter = $__4.transformFilter,
    argsFilter = $__4.argsFilter,
    argsBuilderFilter = $__4.argsBuilderFilter,
    errorFilter = $__4.errorFilter;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
var should = chai.should();
var uppercaseStream = (function(streamable) {
  return streamableToText(streamable).then((function(text) {
    var newText = text.toUpperCase() + '!';
    return textToStreamable(newText);
  }));
});
describe('filter test', (function() {
  it('simple handler', async($traceurRuntime.initGeneratorFunction(function $__9() {
    var filter,
        main,
        handler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            filter = streamFilter((function(config, handler) {
              return (function(args, streamable) {
                return uppercaseStream(streamable).then((function(streamable) {
                  return handler(args, streamable).then(uppercaseStream);
                }));
              });
            }));
            main = simpleHandler((function(args, input) {
              input.should.equal('HELLO!');
              return 'goodbye';
            }), 'text', 'text').middleware(filter);
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 2;
            return main.loadHandler({});
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({}, 'hello').should.eventually.equal('GOODBYE!');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__9, this);
  })));
  it('transform filter', async($traceurRuntime.initGeneratorFunction(function $__10() {
    var uppercase,
        filter,
        main,
        handler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            uppercase = simpleHandler((function(args, input) {
              return input.toUpperCase() + '!';
            }), 'text', 'text');
            filter = transformFilter(uppercase, 'inout');
            main = simpleHandler((function(args, input) {
              input.should.equal('HELLO!');
              return 'goodbye';
            }), 'text', 'text').middleware(filter);
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 2;
            return main.loadHandler({});
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({}, 'hello').should.eventually.equal('GOODBYE!');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__10, this);
  })));
  it('args filter', (function() {
    var filter = argsFilter((function(args) {
      args.foo = 'bar';
    }));
    var main = simpleHandler((function(args) {
      args.foo.should.equal('bar');
      return 'foo';
    }), 'void', 'text').middleware(filter);
    return main.loadHandler({}).then((function(handler) {
      return handler({});
    })).should.eventually.equal('foo');
  }));
  it('args builder filter', async($traceurRuntime.initGeneratorFunction(function $__11() {
    var filter,
        main,
        config,
        handler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            filter = argsBuilderFilter((function(config) {
              should.not.exist(config.handlerModified);
              config.filterModified = true;
              var fooValue = config.fooValue;
              return (function(args) {
                args.foo = fooValue;
              });
            }));
            main = simpleHandlerBuilder((function(config) {
              should.not.exist(config.filterModified);
              config.handlerModified = true;
              return (function(args) {
                args.foo.should.equal('bar');
                return 'foo';
              });
            }), 'void', 'text').middleware(filter);
            config = {fooValue: 'bar'};
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 2;
            return main.loadHandler(config);
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({}).should.eventually.equal('foo');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__11, this);
  })));
  it('error filter', async($traceurRuntime.initGeneratorFunction(function $__12() {
    var filter,
        main,
        handler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            filter = errorFilter((function(err) {
              return textToStreamable('error caught from filter');
            }));
            main = simpleHandler((function(args) {
              throw new Error('error in handler');
            }), 'void', 'text').middleware(filter);
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 2;
            return main.loadHandler({});
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({}).should.eventually.equal('error caught from filter');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__12, this);
  })));
  it('stream handler on http filter', async($traceurRuntime.initGeneratorFunction(function $__13() {
    var filter,
        main,
        handleable,
        $__7,
        streamHandler,
        httpHandler,
        $__8,
        responseHead,
        responseStreamable,
        $__14,
        $__15,
        $__16,
        $__17,
        $__18,
        $__19;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            filter = httpFilter((function(config, handler) {
              return handler;
            }));
            main = simpleHandler((function(args) {
              return 'Hello World';
            }), 'void', 'text').middleware(filter);
            $ctx.state = 18;
            break;
          case 18:
            $ctx.state = 2;
            return main.loadHandleable({});
          case 2:
            handleable = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__7 = handleable, streamHandler = $__7.streamHandler, httpHandler = $__7.httpHandler;
            should.not.exist(streamHandler);
            should.exist(httpHandler);
            $ctx.state = 20;
            break;
          case 20:
            $__14 = new RequestHead();
            $__15 = emptyStreamable();
            $__16 = httpHandler($__14, $__15);
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 6;
            return $__16;
          case 6:
            $__17 = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            $__8 = $__17;
            $__18 = $__8[0];
            responseHead = $__18;
            $__19 = $__8[1];
            responseStreamable = $__19;
            $ctx.state = 12;
            break;
          case 12:
            responseHead.statusCode.should.equal(200);
            $ctx.state = 22;
            break;
          case 22:
            $ctx.state = 14;
            return streamableToText(responseStreamable).should.eventually.equal('Hello World');
          case 14:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__13, this);
  })));
}));
