"use strict";
require('traceur');
var StreamHandler = $traceurRuntime.assertObject(require('../lib/stream-handler.js')).StreamHandler;
var SimpleHandler = $traceurRuntime.assertObject(require('../lib/simple-handler.js')).SimpleHandler;
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var $__0 = $traceurRuntime.assertObject(require('quiver-stream-util')),
    streamableToText = $__0.streamableToText,
    textToStreamable = $__0.textToStreamable;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();
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
      return resolve('goodbye');
    });
    var component = new SimpleHandler(handler, {
      inType: 'text',
      outType: 'text'
    });
    return component.loadHandler({}).then((function(handler) {
      return handler({}, 'hello').should.eventually.equal('goodbye');
    }));
  }));
}));
