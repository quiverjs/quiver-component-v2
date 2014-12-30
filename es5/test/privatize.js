"use strict";
var $__traceur_64_0_46_0_46_7__,
    $__quiver_45_promise__,
    $___46__46__47_lib_47_export_46_js__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_7__ = require("traceur"), $__traceur_64_0_46_0_46_7__ && $__traceur_64_0_46_0_46_7__.__esModule && $__traceur_64_0_46_0_46_7__ || {default: $__traceur_64_0_46_0_46_7__});
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var $__1 = ($___46__46__47_lib_47_export_46_js__ = require("../lib/export.js"), $___46__46__47_lib_47_export_46_js__ && $___46__46__47_lib_47_export_46_js__.__esModule && $___46__46__47_lib_47_export_46_js__ || {default: $___46__46__47_lib_47_export_46_js__}),
    simpleHandlerBuilder = $__1.simpleHandlerBuilder,
    simpleHandler = $__1.simpleHandler,
    transformFilter = $__1.transformFilter;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
var should = chai.should();
describe('privatized component test', (function() {
  it('single component test', (function() {
    var original = simpleHandlerBuilder((function(config) {
      var $__5;
      var $__4 = config,
          greet = ($__5 = $__4.greet) === void 0 ? 'Hello' : $__5;
      return (function(args, name) {
        return greet + ', ' + name;
      });
    }), 'text', 'text');
    var copy1 = original.fork();
    var copy2 = original.fork();
    should.equal(Object.getPrototypeOf(copy1), original);
    should.equal(Object.getPrototypeOf(copy2), original);
    should.not.equal(original.id, copy1.id);
    should.not.equal(original.id, copy2.id);
    should.not.equal(copy1.id, copy2.id);
    var config = {greet: 'Hi'};
    return copy1.loadHandler(config).then((function(handler) {
      return handler({}, 'Alice').should.eventually.equal('Hi, Alice');
    })).then((function() {
      config.greet = 'Yo';
      return copy1.loadHandler(config).then((function(handler) {
        return handler({}, 'Bob').should.eventually.equal('Hi, Bob');
      }));
    })).then((function() {
      config.greet = 'Bonjour';
      return copy2.loadHandler(config).then((function(handler) {
        return handler({}, 'Carl').should.eventually.equal('Bonjour, Carl');
      }));
    }));
  }));
  it('private inheritance', (function() {
    var original = simpleHandlerBuilder((function(config) {
      var $__5;
      var $__4 = config,
          greet = ($__5 = $__4.greet) === void 0 ? 'Hello' : $__5;
      return (function(args, name) {
        return greet + ', ' + name;
      });
    }), 'text', 'text');
    var bundle1 = {};
    var copy1 = original.fork(bundle1);
    var copy11 = original.fork(bundle1);
    should.equal(copy1.id, copy11.id);
    should.equal(copy1, copy11);
    should.equal(Object.getPrototypeOf(copy1), original);
    var copy2 = original.fork();
    should.equal(Object.getPrototypeOf(copy2), original);
    should.not.equal(original.id, copy1.id);
    should.not.equal(original.id, copy2.id);
    should.not.equal(copy1.id, copy2.id);
    var bundle2 = {};
    var copy21 = copy2.fork(bundle2);
    var copy22 = copy2.fork(bundle2);
    should.equal(copy21.id, copy22.id);
    should.equal(copy21, copy22);
    should.equal(Object.getPrototypeOf(copy21), original);
  }));
  it('nested privatize', async($traceurRuntime.initGeneratorFunction(function $__6() {
    var transformCase,
        filter,
        filter1,
        filter2,
        greet,
        greet1,
        greet2,
        greet3,
        config,
        handler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            transformCase = simpleHandlerBuilder((function(config) {
              var transform = config.transform;
              var doTransform = transform == 'uppercase' ? (function(string) {
                return string.toUpperCase();
              }) : (function(string) {
                return string.toLowerCase();
              });
              return (function(args, text) {
                return doTransform(text);
              });
            }), 'text', 'text');
            filter = transformFilter(transformCase, 'out');
            filter1 = filter.fork();
            filter2 = filter.fork();
            should.not.equal(filter1.id, filter2.id);
            should.not.equal(filter1.transformComponent.id, filter2.transformComponent.id);
            greet = simpleHandler((function(args, name) {
              return 'Hello, ' + name;
            }), 'text', 'text');
            greet1 = greet.fork().addMiddleware(filter1);
            greet2 = greet.fork().addMiddleware(filter1);
            greet3 = greet.fork().addMiddleware(filter2);
            config = {transform: 'uppercase'};
            $ctx.state = 26;
            break;
          case 26:
            $ctx.state = 2;
            return greet1.loadHandler(config);
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({}, 'John').should.eventually.equal('HELLO, JOHN');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = 8;
            break;
          case 8:
            config.transform = 'lowercase';
            $ctx.state = 28;
            break;
          case 28:
            $ctx.state = 10;
            return greet2.loadHandler(config);
          case 10:
            handler = $ctx.sent;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.state = 14;
            return handler({}, 'Bob').should.eventually.equal('HELLO, BOB');
          case 14:
            $ctx.maybeThrow();
            $ctx.state = 16;
            break;
          case 16:
            config.transform = 'lowercase';
            $ctx.state = 30;
            break;
          case 30:
            $ctx.state = 18;
            return greet3.loadHandler(config);
          case 18:
            handler = $ctx.sent;
            $ctx.state = 20;
            break;
          case 20:
            $ctx.state = 22;
            return handler({}, 'Alice').should.eventually.equal('hello, alice');
          case 22:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__6, this);
  })));
  it('privatized middlewares', (function() {
    var transformCase = simpleHandlerBuilder((function(config) {
      var transform = config.transform;
      var doTransform = transform == 'uppercase' ? (function(string) {
        return string.toUpperCase();
      }) : (function(string) {
        return string.toLowerCase();
      });
      return (function(args, text) {
        return doTransform(text);
      });
    }), 'text', 'text');
    var filter = transformFilter(transformCase, 'out');
    var greet = simpleHandler((function(args, name) {
      return 'Hello, ' + name;
    }), 'text', 'text').addMiddleware(filter);
    var bundle1 = {};
    var bundle2 = {};
    var greet1 = greet.fork(bundle1);
    var uppercase = transformCase.fork(bundle1);
    var greet2 = greet.fork(bundle2);
    var config = {transform: 'uppercase'};
    return uppercase.loadHandler(config).then((function(handler) {
      return handler({}, 'Test').should.eventually.equal('TEST');
    })).then((function() {
      config.transform = 'lowercase';
      return greet1.loadHandler(config).then((function(handler) {
        return handler({}, 'Alice').should.eventually.equal('HELLO, ALICE');
      }));
    })).then((function() {
      config.transform = 'lowercase';
      return greet2.loadHandler(config).then((function(handler) {
        return handler({}, 'Bob').should.eventually.equal('hello, bob');
      }));
    }));
  }));
}));
