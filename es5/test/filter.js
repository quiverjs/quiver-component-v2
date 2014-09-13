"use strict";
var $__traceur_64_0_46_0_46_58__,
    $__quiver_45_promise__,
    $__quiver_45_simple_45_handler__,
    $__quiver_45_stream_45_util__,
    $__quiver_45_http__,
    $___46__46__47_lib_47_export_46_js__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var $__0 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    async = $__0.async,
    resolve = $__0.resolve;
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
    errorFilter = $__4.errorFilter,
    inputHandlerMiddleware = $__4.inputHandlerMiddleware;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
var uppercaseStream = (function(streamable) {
  return streamableToText(streamable).then((function(text) {
    var newText = text.toUpperCase() + '!';
    return textToStreamable(newText);
  }));
});
describe('filter test', (function() {
  it('simple handler', async($traceurRuntime.initGeneratorFunction(function $__6() {
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
            }), 'text', 'text').addMiddleware(filter);
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
    }, $__6, this);
  })));
  it('transform filter', async($traceurRuntime.initGeneratorFunction(function $__7() {
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
            }), 'text', 'text').addMiddleware(filter);
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
    }, $__7, this);
  })));
  it('args filter', (function() {
    var filter = argsFilter((function(args) {
      args.foo = 'bar';
      return args;
    }));
    var main = simpleHandler((function(args) {
      args.foo.should.equal('bar');
      return 'foo';
    }), 'void', 'text').addMiddleware(filter);
    return main.loadHandler({}).then((function(handler) {
      return handler({});
    })).should.eventually.equal('foo');
  }));
  it('args builder filter', (function() {
    var filter = argsBuilderFilter((function(config) {
      var fooValue = config.fooValue;
      return (function(args) {
        args.foo = fooValue;
        return args;
      });
    }));
    var main = simpleHandler((function(args) {
      args.foo.should.equal('bar');
      return 'foo';
    }), 'void', 'text').addMiddleware(filter);
    return main.loadHandler({fooValue: 'bar'}).then((function(handler) {
      return handler({});
    })).should.eventually.equal('foo');
  }));
  it('args helper filter', async($traceurRuntime.initGeneratorFunction(function $__8() {
    var filter,
        main,
        handleable,
        mainHandler,
        cacheIdHandler,
        json;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            filter = argsFilter((function(args) {
              args.foo = 'bar';
              return args;
            }));
            main = makeHandleable({
              streamHandler: (function(args, streamable) {
                args.foo.should.equal('bar');
                return textToStreamable('main');
              }),
              meta: {cacheId: (function(args, streamable) {
                  args.foo.should.equal('bar');
                  return jsonToStreamable({cacheId: 123});
                })}
            }).addMiddleware(filter);
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 2;
            return main.loadHandleable({});
          case 2:
            handleable = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            mainHandler = streamToSimpleHandler(handleable.streamHandler, 'void', 'text');
            cacheIdHandler = streamToSimpleHandler(handleable.meta.cacheId, 'void', 'json');
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 6;
            return mainHandler({}).should.eventually.equal('main');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 10;
            return cacheIdHandler({});
          case 10:
            json = $ctx.sent;
            $ctx.state = 12;
            break;
          case 12:
            json.cacheId.should.equal(123);
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__8, this);
  })));
  it('error filter', async($traceurRuntime.initGeneratorFunction(function $__9() {
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
            }), 'void', 'text').addMiddleware(filter);
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
    }, $__9, this);
  })));
  it('input handler', async($traceurRuntime.initGeneratorFunction(function $__10() {
    var uppercase,
        filter,
        main,
        handler,
        json;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            uppercase = simpleHandler((function(args, input) {
              return input.toUpperCase() + '!';
            }), 'text', 'text');
            filter = inputHandlerMiddleware(uppercase, 'inHandler');
            main = simpleHandlerBuilder((function(config) {
              var inHandler = config.inHandler;
              should.exist(inHandler);
              return async($traceurRuntime.initGeneratorFunction(function $__11(args, input) {
                var result;
                return $traceurRuntime.createGeneratorInstance(function($ctx) {
                  while (true)
                    switch ($ctx.state) {
                      case 0:
                        $ctx.state = 2;
                        return inHandler(args, input);
                      case 2:
                        result = $ctx.sent;
                        $ctx.state = 4;
                        break;
                      case 4:
                        $ctx.returnValue = {
                          status: 'ok',
                          result: result
                        };
                        $ctx.state = -2;
                        break;
                      default:
                        return $ctx.end();
                    }
                }, $__11, this);
              }));
            }), 'text', 'json').addMiddleware(filter);
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
            return handler({}, 'hello');
          case 6:
            json = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            json.status.should.equal('ok');
            json.result.should.equal('HELLO!');
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__10, this);
  })));
  it('stream handler on http filter', async($traceurRuntime.initGeneratorFunction(function $__11() {
    var filter,
        main,
        handleable,
        $__5,
        streamHandler,
        httpHandler,
        responseHead,
        responseStreamable,
        $__12,
        $__13,
        $__14,
        $__15,
        $__16,
        $__17;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            filter = httpFilter((function(config, handler) {
              return handler;
            }));
            main = simpleHandler((function(args) {
              return 'Hello World';
            }), 'void', 'text').addMiddleware(filter);
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
            $__5 = handleable, streamHandler = $__5.streamHandler, httpHandler = $__5.httpHandler;
            should.not.exist(streamHandler);
            should.exist(httpHandler);
            $ctx.state = 20;
            break;
          case 20:
            $__12 = new RequestHead();
            $__13 = emptyStreamable();
            $__14 = httpHandler($__12, $__13);
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 6;
            return $__14;
          case 6:
            $__15 = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            $__5 = $__15;
            $__16 = $__5[0];
            responseHead = $__16;
            $__17 = $__5[1];
            responseStreamable = $__17;
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
    }, $__11, this);
  })));
}));
