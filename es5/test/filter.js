"use strict";
require('traceur');
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var $__0 = $traceurRuntime.assertObject(require('quiver-stream-util')),
    streamableToText = $__0.streamableToText,
    textToStreamable = $__0.textToStreamable;
var SimpleHandler = $traceurRuntime.assertObject(require('../lib/simple-handler.js')).SimpleHandler;
var StreamFilter = $traceurRuntime.assertObject(require('../lib/filter.js')).StreamFilter;
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
  it('simple handler', (function() {
    var handler = (function(args, input) {
      input.should.equal('HELLO!');
      return 'goodbye';
    });
    var handlerComponent = new SimpleHandler(handler, {
      inType: 'text',
      outType: 'text'
    });
    var filter = (function(config, handler) {
      return (function(args, streamable) {
        return uppercaseStream(streamable).then((function(streamable) {
          return handler(args, streamable).then(uppercaseStream);
        }));
      });
    });
    var filterComponent = new StreamFilter(filter);
    handlerComponent.addMiddleware(filterComponent);
    return handlerComponent.loadHandler({}).then((function(handler) {
      return handler({}, 'hello');
    })).should.eventually.equal('GOODBYE!');
  }));
}));
