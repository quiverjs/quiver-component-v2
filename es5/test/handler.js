"use strict";
require('traceur');
var StreamHandler = $traceurRuntime.assertObject(require('../lib/stream-handler.js')).StreamHandler;
var SimpleHandler = $traceurRuntime.assertObject(require('../lib/simple-handler.js')).SimpleHandler;
var HttpHandlerBuilder = $traceurRuntime.assertObject(require('../lib/http-handler.js')).HttpHandlerBuilder;
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var $__0 = $traceurRuntime.assertObject(require('quiver-stream-util')),
    streamableToText = $__0.streamableToText,
    textToStreamable = $__0.textToStreamable;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
describe('handler test', (function() {
  it('stream handler', (function() {
    var component = new StreamHandler((function(args, streamable) {
      return streamableToText(streamable).then((function(input) {
        input.should.equal('hello');
        return textToStreamable('goodbye');
      }));
    }));
    return component.handleableBuilder({}).then((function(handleable) {
      var handler = handleable.streamHandler;
      var input = textToStreamable('hello');
      return handler({}, input).then(streamableToText).should.eventually.equal('goodbye');
    }));
  }));
  it('simple handler', (function() {
    var handler = (function(args, input) {
      input.should.equal('hello');
      return 'goodbye';
    });
    var component = new SimpleHandler(handler, {
      inType: 'text',
      outType: 'text'
    });
    return component.loadHandler({}).then((function(handler) {
      return handler({}, 'hello').should.eventually.equal('goodbye');
    }));
  }));
  it('http builder', (function() {
    var builder = (function(config) {
      var greet = config.greet || 'hi';
      return (function(requestHead, streamable) {
        return streamableToText(streamable).then((function(input) {
          input.should.equal('hello');
          return {
            responseHead: {statusCode: 200},
            responseStreamable: textToStreamable(greet)
          };
        }));
      });
    });
    var component = new HttpHandlerBuilder(builder);
    var config = {greet: 'goodbye'};
    return component.loadHandleable(config).then((function(handleable) {
      var handler = handleable.httpHandler;
      should.exist(handler);
      var input = textToStreamable('hello');
      return handler({}, input).then((function($__0) {
        var responseHead = $__0.responseHead,
            responseStreamable = $__0.responseStreamable;
        responseHead.statusCode.should.equal(200);
        return streamableToText(responseStreamable).should.eventually.equal('goodbye');
      }));
    }));
  }));
}));
