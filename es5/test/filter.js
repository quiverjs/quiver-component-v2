"use strict";
require('traceur');
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var $__0 = $traceurRuntime.assertObject(require('quiver-stream-util')),
    streamableToText = $__0.streamableToText,
    textToStreamable = $__0.textToStreamable;
var $__0 = $traceurRuntime.assertObject(require('../lib/export.js')),
    SimpleHandler = $__0.SimpleHandler,
    SimpleHandlerBuilder = $__0.SimpleHandlerBuilder,
    StreamFilter = $__0.StreamFilter,
    TransformFilter = $__0.TransformFilter,
    ArgsFilter = $__0.ArgsFilter,
    ArgsBuilderFilter = $__0.ArgsBuilderFilter,
    ErrorFilter = $__0.ErrorFilter,
    InputHandlerMiddleware = $__0.InputHandlerMiddleware;
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
    var filter = new StreamFilter((function(config, handler) {
      return (function(args, streamable) {
        return uppercaseStream(streamable).then((function(streamable) {
          return handler(args, streamable).then(uppercaseStream);
        }));
      });
    }));
    var main = new SimpleHandler((function(args, input) {
      input.should.equal('HELLO!');
      return 'goodbye';
    }), 'text', 'text').addMiddleware(filter);
    return main.loadHandler({}).then((function(handler) {
      return handler({}, 'hello');
    })).should.eventually.equal('GOODBYE!');
  }));
  it('transform filter', (function() {
    var uppercase = new SimpleHandler((function(args, input) {
      return input.toUpperCase() + '!';
    }), 'text', 'text');
    var filter = new TransformFilter(uppercase, 'inout');
    var main = new SimpleHandler((function(args, input) {
      input.should.equal('HELLO!');
      return 'goodbye';
    }), 'text', 'text').addMiddleware(filter);
    return main.loadHandler({}).then((function(handler) {
      return handler({}, 'hello');
    })).should.eventually.equal('GOODBYE!');
  }));
  it('args filter', (function() {
    var filter = new ArgsFilter((function(args) {
      args.foo = 'bar';
      return args;
    }));
    var main = new SimpleHandler((function(args) {
      args.foo.should.equal('bar');
      return 'foo';
    }), 'void', 'text').addMiddleware(filter);
    return main.loadHandler({}).then((function(handler) {
      return handler({});
    })).should.eventually.equal('foo');
  }));
  it('args builder filter', (function() {
    var filter = new ArgsBuilderFilter((function(config) {
      var fooValue = config.fooValue;
      return (function(args) {
        args.foo = fooValue;
        return args;
      });
    }));
    var main = new SimpleHandler((function(args) {
      args.foo.should.equal('bar');
      return 'foo';
    }), 'void', 'text').addMiddleware(filter);
    return main.loadHandler({fooValue: 'bar'}).then((function(handler) {
      return handler({});
    })).should.eventually.equal('foo');
  }));
  it('error filter', (function() {
    var filter = new ErrorFilter((function(err) {
      return textToStreamable('error caught from filter');
    }));
    var main = new SimpleHandler((function(args) {
      throw new Error('error in handler');
    }), 'void', 'text').addMiddleware(filter);
    return main.loadHandler({}).then((function(handler) {
      return handler({});
    })).should.eventually.equal('error caught from filter');
  }));
  it('input handler', (function() {
    var uppercase = new SimpleHandler((function(args, input) {
      return input.toUpperCase() + '!';
    }), 'text', 'text');
    var filter = new InputHandlerMiddleware(uppercase, 'inHandler');
    var main = new SimpleHandlerBuilder((function(config) {
      var inHandler = config.inHandler;
      should.exist(inHandler);
      return (function(args, input) {
        return inHandler(args, input).then((function(result) {
          return ({
            status: 'ok',
            result: result
          });
        }));
      });
    }), 'text', 'json').addMiddleware(filter);
    return main.loadHandler({}).then((function(handler) {
      return handler({}, 'hello').then((function(json) {
        json.status.should.equal('ok');
        json.result.should.equal('HELLO!');
      }));
    }));
  }));
}));
