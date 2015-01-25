"use strict";
var $__traceur_64_0_46_0_46_8__,
    $__quiver_45_promise__,
    $__quiver_45_simple_45_handler__,
    $__quiver_45_stream_45_util__,
    $__quiver_45_http__,
    $___46__46__47_lib_47_export_46_js__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_8__ = require("traceur"), $__traceur_64_0_46_0_46_8__ && $__traceur_64_0_46_0_46_8__.__esModule && $__traceur_64_0_46_0_46_8__ || {default: $__traceur_64_0_46_0_46_8__});
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
let should = chai.should();
let uppercaseStream = (function(streamable) {
  return streamableToText(streamable).then((function(text) {
    let newText = text.toUpperCase() + '!';
    return textToStreamable(newText);
  }));
});
describe('filter test', (function() {
  it('simple handler', async(function*() {
    let filter = streamFilter((function(config, handler) {
      return (function(args, streamable) {
        return uppercaseStream(streamable).then((function(streamable) {
          return handler(args, streamable).then(uppercaseStream);
        }));
      });
    }));
    let main = simpleHandler((function(args, input) {
      input.should.equal('HELLO!');
      return 'goodbye';
    }), 'text', 'text').middleware(filter);
    let handler = yield main.loadHandler({});
    yield handler({}, 'hello').should.eventually.equal('GOODBYE!');
  }));
  it('transform filter', async(function*() {
    let uppercase = simpleHandler((function(args, input) {
      return input.toUpperCase() + '!';
    }), 'text', 'text');
    let filter = transformFilter(uppercase, 'inout');
    let main = simpleHandler((function(args, input) {
      input.should.equal('HELLO!');
      return 'goodbye';
    }), 'text', 'text').middleware(filter);
    let handler = yield main.loadHandler({});
    yield handler({}, 'hello').should.eventually.equal('GOODBYE!');
  }));
  it('args filter', async(function*() {
    let main = simpleHandler((function(args) {
      args.foo.should.equal('bar');
      return 'foo';
    }), 'void', 'text').argsFilter((function(args) {
      args.foo = 'bar';
    }));
    let handler = yield main.loadHandler({});
    yield handler({}).should.eventually.equal('foo');
  }));
  it('args builder filter', async(function*() {
    let filter = argsBuilderFilter((function(config) {
      should.not.exist(config.handlerModified);
      config.filterModified = true;
      let fooValue = config.fooValue;
      return (function(args) {
        args.foo = fooValue;
      });
    }));
    let main = simpleHandlerBuilder((function(config) {
      should.not.exist(config.filterModified);
      config.handlerModified = true;
      return (function(args) {
        args.foo.should.equal('bar');
        return 'foo';
      });
    }), 'void', 'text').middleware(filter);
    let config = {fooValue: 'bar'};
    let handler = yield main.loadHandler(config);
    yield handler({}).should.eventually.equal('foo');
  }));
  it('error filter', async(function*() {
    let filter = errorFilter((function(err) {
      return textToStreamable('error caught from filter');
    }));
    let main = simpleHandler((function(args) {
      throw new Error('error in handler');
    }), 'void', 'text').middleware(filter);
    let handler = yield main.loadHandler({});
    yield handler({}).should.eventually.equal('error caught from filter');
  }));
  it('stream handler on http filter', async(function*() {
    var $__9,
        $__10;
    let filter = httpFilter((function(config, handler) {
      return handler;
    }));
    let main = simpleHandler((function(args) {
      return 'Hello World';
    }), 'void', 'text').middleware(filter);
    let handleable = yield main.loadHandleable({});
    let $__7 = handleable,
        streamHandler = $__7.streamHandler,
        httpHandler = $__7.httpHandler;
    should.not.exist(streamHandler);
    should.exist(httpHandler);
    let $__8 = yield httpHandler(new RequestHead(), emptyStreamable()),
        responseHead = ($__9 = $__8[$traceurRuntime.toProperty(Symbol.iterator)](), ($__10 = $__9.next()).done ? void 0 : $__10.value),
        responseStreamable = ($__10 = $__9.next()).done ? void 0 : $__10.value;
    responseHead.statusCode.should.equal(200);
    yield streamableToText(responseStreamable).should.eventually.equal('Hello World');
  }));
}));
