"use strict";
var $__traceur_64_0_46_0_46_58__,
    $___46__46__47_lib_47_export_46_js__,
    $__quiver_45_promise__,
    $__quiver_45_stream_45_util__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var $__0 = ($___46__46__47_lib_47_export_46_js__ = require("../lib/export.js"), $___46__46__47_lib_47_export_46_js__ && $___46__46__47_lib_47_export_46_js__.__esModule && $___46__46__47_lib_47_export_46_js__ || {default: $___46__46__47_lib_47_export_46_js__}),
    streamHandler = $__0.streamHandler,
    simpleHandler = $__0.simpleHandler,
    httpHandlerBuilder = $__0.httpHandlerBuilder;
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var $__2 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    streamableToText = $__2.streamableToText,
    textToStreamable = $__2.textToStreamable;
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
      return 'goodbye';
    }), 'text', 'text');
    return main.loadHandler({}).then((function(handler) {
      return handler({}, 'hello').should.eventually.equal('goodbye');
    }));
  }));
  it('http builder', (function() {
    var main = httpHandlerBuilder((function(config) {
      var greet = config.greet || 'hi';
      return (function(requestHead, streamable) {
        return streamableToText(streamable).then((function(input) {
          input.should.equal('hello');
          return [{statusCode: 200}, textToStreamable(greet)];
        }));
      });
    }));
    var config = {greet: 'goodbye'};
    return main.loadHandleable(config).then((function(handleable) {
      var handler = handleable.httpHandler;
      should.exist(handler);
      var input = textToStreamable('hello');
      return handler({}, input).then((function($__3) {
        var $__4 = $__3,
            responseHead = $__4[0],
            responseStreamable = $__4[1];
        responseHead.statusCode.should.equal(200);
        return streamableToText(responseStreamable).should.eventually.equal('goodbye');
      }));
    }));
  }));
}));
