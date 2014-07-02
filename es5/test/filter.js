"use strict";
require('traceur');
var resolve = $traceurRuntime.assertObject(require('quiver-promise')).resolve;
var $__0 = $traceurRuntime.assertObject(require('quiver-stream-util')),
    streamableToText = $__0.streamableToText,
    textToStreamable = $__0.textToStreamable;
var $__0 = $traceurRuntime.assertObject(require('../lib/simple-handler.js')),
    SimpleHandler = $__0.SimpleHandler,
    SimpleHandlerBuilder = $__0.SimpleHandlerBuilder;
var StreamFilter = $traceurRuntime.assertObject(require('../lib/filter.js')).StreamFilter;
var TransformFilter = $traceurRuntime.assertObject(require('../lib/transform-filter.js')).TransformFilter;
var $__0 = $traceurRuntime.assertObject(require('../lib/simple-filter.js')),
    ArgsFilter = $__0.ArgsFilter,
    ArgsBuilderFilter = $__0.ArgsBuilderFilter,
    ErrorFilter = $__0.ErrorFilter;
var InputHandlerMiddleware = $traceurRuntime.assertObject(require('../lib/input-handler.js')).InputHandlerMiddleware;
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
  it('transform filter', (function() {
    var handler = (function(args, input) {
      input.should.equal('HELLO!');
      return 'goodbye';
    });
    var handlerComponent = new SimpleHandler(handler, {
      inType: 'text',
      outType: 'text'
    });
    var transformHandler = (function(args, input) {
      return input.toUpperCase() + '!';
    });
    var transformComponent = new SimpleHandler(transformHandler, {
      inType: 'text',
      outType: 'text'
    });
    var filterComponent = new TransformFilter(transformComponent, {transformMode: 'inout'});
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
    var handlerComponent = new SimpleHandler(handler, {
      inType: 'void',
      outType: 'text'
    });
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
    var handlerComponent = new SimpleHandler(handler, {
      inType: 'void',
      outType: 'text'
    });
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
    var handlerComponent = new SimpleHandler(handler, {
      inType: 'void',
      outType: 'text'
    });
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
    var handlerComponent = new SimpleHandlerBuilder(builder, {
      inType: 'text',
      outType: 'json'
    });
    var inputHandler = (function(args, input) {
      return input.toUpperCase() + '!';
    });
    var inputComponent = new SimpleHandler(inputHandler, {
      inType: 'text',
      outType: 'text'
    });
    var filterComponent = new InputHandlerMiddleware(inputComponent, {toConfig: 'inHandler'});
    handlerComponent.addMiddleware(filterComponent);
    return handlerComponent.loadHandler({}).then((function(handler) {
      return handler({}, 'hello').then((function(json) {
        json.status.should.equal('ok');
        json.result.should.equal('HELLO!');
      }));
    }));
  }));
}));
