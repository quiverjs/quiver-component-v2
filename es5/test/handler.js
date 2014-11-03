"use strict";
var $__traceur_64_0_46_0_46_7__,
    $__quiver_45_promise__,
    $__quiver_45_http__,
    $__quiver_45_stream_45_util__,
    $___46__46__47_lib_47_export_46_js__;
($__traceur_64_0_46_0_46_7__ = require("traceur"), $__traceur_64_0_46_0_46_7__ && $__traceur_64_0_46_0_46_7__.__esModule && $__traceur_64_0_46_0_46_7__ || {default: $__traceur_64_0_46_0_46_7__});
var $__0 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    async = $__0.async,
    resolve = $__0.resolve;
var $__1 = ($__quiver_45_http__ = require("quiver-http"), $__quiver_45_http__ && $__quiver_45_http__.__esModule && $__quiver_45_http__ || {default: $__quiver_45_http__}),
    RequestHead = $__1.RequestHead,
    ResponseHead = $__1.ResponseHead;
var $__2 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    streamableToText = $__2.streamableToText,
    textToStreamable = $__2.textToStreamable;
var $__3 = ($___46__46__47_lib_47_export_46_js__ = require("../lib/export.js"), $___46__46__47_lib_47_export_46_js__ && $___46__46__47_lib_47_export_46_js__.__esModule && $___46__46__47_lib_47_export_46_js__ || {default: $___46__46__47_lib_47_export_46_js__}),
    streamHandler = $__3.streamHandler,
    simpleHandler = $__3.simpleHandler,
    httpHandlerBuilder = $__3.httpHandlerBuilder;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
describe('handler test', (function() {
  it('stream handler', (function() {
    var main = streamHandler((function(args, streamable) {
      return streamableToText(streamable).then((function(input) {
        input.should.equal('hello');
        return textToStreamable('goodbye');
      }));
    }));
    return main.handleableBuilder({}).then((function(handleable) {
      var handler = handleable.streamHandler;
      var input = textToStreamable('hello');
      return handler({}, input).then(streamableToText).should.eventually.equal('goodbye');
    }));
  }));
  it('simple handler', (function() {
    var main = simpleHandler((function(args, input) {
      input.should.equal('hello');
      return '<b>goodbye</b>';
    }), 'text', 'html');
    return main.loadHandler({}).then((function(handler) {
      return handler({}, 'hello').should.eventually.equal('<b>goodbye</b>');
    }));
  }));
  it('http builder', async($traceurRuntime.initGeneratorFunction(function $__5() {
    var main,
        config,
        handleable,
        handler,
        input,
        $__4,
        responseHead,
        responseStreamable,
        $__7,
        $__8,
        $__9,
        $__10,
        $__11;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            main = httpHandlerBuilder((function(config) {
              var greet = config.greet || 'hi';
              config.modified = true;
              return async($traceurRuntime.initGeneratorFunction(function $__6(requestHead, streamable) {
                var input;
                return $traceurRuntime.createGeneratorInstance(function($ctx) {
                  while (true)
                    switch ($ctx.state) {
                      case 0:
                        $ctx.state = 2;
                        return streamableToText(streamable);
                      case 2:
                        input = $ctx.sent;
                        $ctx.state = 4;
                        break;
                      case 4:
                        input.should.equal('hello');
                        $ctx.state = 8;
                        break;
                      case 8:
                        $ctx.returnValue = [new ResponseHead(), textToStreamable(greet)];
                        $ctx.state = -2;
                        break;
                      default:
                        return $ctx.end();
                    }
                }, $__6, this);
              }));
            }));
            config = {greet: 'goodbye'};
            $ctx.state = 18;
            break;
          case 18:
            $ctx.state = 2;
            return main.loadHandleable(config);
          case 2:
            handleable = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            should.not.exist(config.modified);
            handler = handleable.httpHandler;
            should.exist(handler);
            input = textToStreamable('hello');
            $ctx.state = 20;
            break;
          case 20:
            $__7 = new RequestHead();
            $__8 = handler($__7, input);
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 6;
            return $__8;
          case 6:
            $__9 = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            $__4 = $__9;
            $__10 = $__4[0];
            responseHead = $__10;
            $__11 = $__4[1];
            responseStreamable = $__11;
            $ctx.state = 12;
            break;
          case 12:
            responseHead.statusCode.should.equal(200);
            $ctx.state = 22;
            break;
          case 22:
            $ctx.state = 14;
            return streamableToText(responseStreamable).should.eventually.equal('goodbye');
          case 14:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__5, this);
  })));
}));
