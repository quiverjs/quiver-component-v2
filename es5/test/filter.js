"use strict";
var $__traceur_64_0_46_0_46_58__,
    $__quiver_45_promise__,
    $__quiver_45_simple_45_handler__,
    $__quiver_45_stream_45_util__,
    $___46__46__47_lib_47_export_46_js__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var resolve = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).resolve;
var streamToSimpleHandler = ($__quiver_45_simple_45_handler__ = require("quiver-simple-handler"), $__quiver_45_simple_45_handler__ && $__quiver_45_simple_45_handler__.__esModule && $__quiver_45_simple_45_handler__ || {default: $__quiver_45_simple_45_handler__}).streamToSimpleHandler;
var $__2 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    streamableToText = $__2.streamableToText,
    textToStreamable = $__2.textToStreamable,
    emptyStreamable = $__2.emptyStreamable,
    jsonToStreamable = $__2.jsonToStreamable;
var $__3 = ($___46__46__47_lib_47_export_46_js__ = require("../lib/export.js"), $___46__46__47_lib_47_export_46_js__ && $___46__46__47_lib_47_export_46_js__.__esModule && $___46__46__47_lib_47_export_46_js__ || {default: $___46__46__47_lib_47_export_46_js__}),
    simpleHandler = $__3.simpleHandler,
    simpleHandlerBuilder = $__3.simpleHandlerBuilder,
    handleable = $__3.handleable,
    streamFilter = $__3.streamFilter,
    transformFilter = $__3.transformFilter,
    argsFilter = $__3.argsFilter,
    argsBuilderFilter = $__3.argsBuilderFilter,
    errorFilter = $__3.errorFilter,
    inputHandlerMiddleware = $__3.inputHandlerMiddleware;
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
    var filter = streamFilter((function(config, handler) {
      return (function(args, streamable) {
        return uppercaseStream(streamable).then((function(streamable) {
          return handler(args, streamable).then(uppercaseStream);
        }));
      });
    }));
    var main = simpleHandler((function(args, input) {
      input.should.equal('HELLO!');
      return 'goodbye';
    }), 'text', 'text').addMiddleware(filter);
    return main.loadHandler({}).then((function(handler) {
      return handler({}, 'hello');
    })).should.eventually.equal('GOODBYE!');
  }));
  it('transform filter', (function() {
    var uppercase = simpleHandler((function(args, input) {
      return input.toUpperCase() + '!';
    }), 'text', 'text');
    var filter = transformFilter(uppercase, 'inout');
    var main = simpleHandler((function(args, input) {
      input.should.equal('HELLO!');
      return 'goodbye';
    }), 'text', 'text').addMiddleware(filter);
    return main.loadHandler({}).then((function(handler) {
      return handler({}, 'hello');
    })).should.eventually.equal('GOODBYE!');
  }));
  it('args filter', (function() {
    var filter = argsFilter((function(args) {
      args.foo = 'bar';
      return args;
    }));
    var main = simpleHandler((function(args) {
      args.foo.should.equal('bar');
      return 'foo';
    }), 'void', 'text').addMiddleware(filter);
    return main.loadHandler({}).then((function(handler) {
      return handler({});
    })).should.eventually.equal('foo');
  }));
  it('args builder filter', (function() {
    var filter = argsBuilderFilter((function(config) {
      var fooValue = config.fooValue;
      return (function(args) {
        args.foo = fooValue;
        return args;
      });
    }));
    var main = simpleHandler((function(args) {
      args.foo.should.equal('bar');
      return 'foo';
    }), 'void', 'text').addMiddleware(filter);
    return main.loadHandler({fooValue: 'bar'}).then((function(handler) {
      return handler({});
    })).should.eventually.equal('foo');
  }));
  it('args helper filter', (function() {
    var filter = argsFilter((function(args) {
      args.foo = 'bar';
      return args;
    }));
    var main = handleable({
      streamHandler: (function(args, streamable) {
        args.foo.should.equal('bar');
        return textToStreamable('main');
      }),
      meta: {cacheId: (function(args, streamable) {
          args.foo.should.equal('bar');
          return jsonToStreamable({cacheId: 123});
        })}
    }).addMiddleware(filter);
    return main.loadHandleable({}).then((function(handleable) {
      var mainHandler = streamToSimpleHandler(handleable.streamHandler, 'void', 'text');
      var cacheIdHandler = streamToSimpleHandler(handleable.meta.cacheId, 'void', 'json');
      var p1 = mainHandler({}).should.eventually.equal('main');
      var p2 = cacheIdHandler({}).then((function(json) {
        json.cacheId.should.equal(123);
      }));
      return Promise.all([p1, p2]);
    }));
  }));
  it('error filter', (function() {
    var filter = errorFilter((function(err) {
      return textToStreamable('error caught from filter');
    }));
    var main = simpleHandler((function(args) {
      throw new Error('error in handler');
    }), 'void', 'text').addMiddleware(filter);
    return main.loadHandler({}).then((function(handler) {
      return handler({});
    })).should.eventually.equal('error caught from filter');
  }));
  it('input handler', (function() {
    var uppercase = simpleHandler((function(args, input) {
      return input.toUpperCase() + '!';
    }), 'text', 'text');
    var filter = inputHandlerMiddleware(uppercase, 'inHandler');
    var main = simpleHandlerBuilder((function(config) {
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
