"use strict";
var $__traceur_64_0_46_0_46_8__,
    $__quiver_45_promise__,
    $__quiver_45_http__,
    $__quiver_45_stream_45_util__,
    $___46__46__47_lib_47_export_46_js__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_8__ = require("traceur"), $__traceur_64_0_46_0_46_8__ && $__traceur_64_0_46_0_46_8__.__esModule && $__traceur_64_0_46_0_46_8__ || {default: $__traceur_64_0_46_0_46_8__});
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
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
let should = chai.should();
describe('handler test', (function() {
  it('stream handler', (function() {
    let main = streamHandler((function(args, streamable) {
      return streamableToText(streamable).then((function(input) {
        input.should.equal('hello');
        return textToStreamable('goodbye');
      }));
    }));
    return main.toHandleableBuilder()({}).then((function(handleable) {
      let handler = handleable.streamHandler;
      let input = textToStreamable('hello');
      return handler({}, input).then(streamableToText).should.eventually.equal('goodbye');
    }));
  }));
  it('simple handler', (function() {
    let main = simpleHandler((function(args, input) {
      input.should.equal('hello');
      return '<b>goodbye</b>';
    }), 'text', 'html');
    return main.loadHandler({}).then((function(handler) {
      return handler({}, 'hello').should.eventually.equal('<b>goodbye</b>');
    }));
  }));
  it('http builder', async(function*() {
    var $__7,
        $__8;
    let main = httpHandlerBuilder((function(config) {
      let greet = config.greet || 'hi';
      config.modified = true;
      return async(function*(requestHead, streamable) {
        let input = yield streamableToText(streamable);
        input.should.equal('hello');
        return [new ResponseHead(), textToStreamable(greet)];
      });
    }));
    let config = {greet: 'goodbye'};
    let handleable = yield main.loadHandleable(config);
    should.not.exist(config.modified);
    let handler = handleable.httpHandler;
    should.exist(handler);
    let input = textToStreamable('hello');
    let $__6 = yield handler(new RequestHead(), input),
        responseHead = ($__7 = $__6[$traceurRuntime.toProperty(Symbol.iterator)](), ($__8 = $__7.next()).done ? void 0 : $__8.value),
        responseStreamable = ($__8 = $__7.next()).done ? void 0 : $__8.value;
    responseHead.statusCode.should.equal(200);
    yield streamableToText(responseStreamable).should.eventually.equal('goodbye');
  }));
}));
