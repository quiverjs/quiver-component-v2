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
    var handler = (function(args, input) {
      input.should.equal('HELLO!');
      return 'goodbye';
    });
    var handlerComponent = new SimpleHandler(handler, 'text', 'text');
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
  it('transform filter', (function() {
    var handler = (function(args, input) {
      input.should.equal('HELLO!');
      return 'goodbye';
    });
    var handlerComponent = new SimpleHandler(handler, 'text', 'text');
    var transformHandler = (function(args, input) {
      return input.toUpperCase() + '!';
    });
    var transformComponent = new SimpleHandler(transformHandler, 'text', 'text');
    var filterComponent = new TransformFilter(transformComponent, 'inout');
    handlerComponent.addMiddleware(filterComponent);
    return handlerComponent.loadHandler({}).then((function(handler) {
      return handler({}, 'hello');
    })).should.eventually.equal('GOODBYE!');
  }));
  it('args filter', (function() {
    var handler = (function(args) {
      args.foo.should.equal('bar');
      return 'foo';
    });
    var handlerComponent = new SimpleHandler(handler, 'void', 'text');
    var argsFilter = (function(args) {
      args.foo = 'bar';
      return args;
    });
    var filterComponent = new ArgsFilter(argsFilter);
    handlerComponent.addMiddleware(filterComponent);
    return handlerComponent.loadHandler({}).then((function(handler) {
      return handler({});
    })).should.eventually.equal('foo');
  }));
  it('args builder filter', (function() {
    var handler = (function(args) {
      args.foo.should.equal('bar');
      return 'foo';
    });
    var handlerComponent = new SimpleHandler(handler, 'void', 'text');
    var argsBuilder = (function(config) {
      var fooValue = config.fooValue;
      return (function(args) {
        args.foo = fooValue;
        return args;
      });
    });
    var filterComponent = new ArgsBuilderFilter(argsBuilder);
    handlerComponent.addMiddleware(filterComponent);
    return handlerComponent.loadHandler({fooValue: 'bar'}).then((function(handler) {
      return handler({});
    })).should.eventually.equal('foo');
  }));
  it('error filter', (function() {
    var handler = (function(args) {
      throw new Error('error in handler');
    });
    var handlerComponent = new SimpleHandler(handler, 'void', 'text');
    var errorFilter = (function(err) {
      return textToStreamable('error caught from filter');
    });
    var filterComponent = new ErrorFilter(errorFilter);
    handlerComponent.addMiddleware(filterComponent);
    return handlerComponent.loadHandler({}).then((function(handler) {
      return handler({});
    })).should.eventually.equal('error caught from filter');
  }));
  it('input handler', (function() {
    var builder = (function(config) {
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
    });
    var handlerComponent = new SimpleHandlerBuilder(builder, 'text', 'json');
    var inputHandler = (function(args, input) {
      return input.toUpperCase() + '!';
    });
    var inputComponent = new SimpleHandler(inputHandler, 'text', 'text');
    var filterComponent = new InputHandlerMiddleware(inputComponent, 'inHandler');
    handlerComponent.addMiddleware(filterComponent);
    return handlerComponent.loadHandler({}).then((function(handler) {
      return handler({}, 'hello').then((function(json) {
        json.status.should.equal('ok');
        json.result.should.equal('HELLO!');
      }));
    }));
  }));
}));
