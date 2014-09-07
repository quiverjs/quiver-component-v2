"use strict";
var $__traceur_64_0_46_0_46_58__,
    $___46__46__47_lib_47_export_46_js__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var $__0 = ($___46__46__47_lib_47_export_46_js__ = require("../lib/export.js"), $___46__46__47_lib_47_export_46_js__ && $___46__46__47_lib_47_export_46_js__.__esModule && $___46__46__47_lib_47_export_46_js__ || {default: $___46__46__47_lib_47_export_46_js__}),
    simpleHandlerBuilder = $__0.simpleHandlerBuilder,
    simpleHandler = $__0.simpleHandler,
    transformFilter = $__0.transformFilter;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
describe('privatized component test', (function() {
  it('single component test', (function() {
    var original = simpleHandlerBuilder((function(config) {
      var $__2;
      var $__1 = config,
          greet = ($__2 = $__1.greet) === void 0 ? 'Hello' : $__2;
      return (function(args, name) {
        return greet + ', ' + name;
      });
    }), 'text', 'text');
    var copy1 = original.makePrivate();
    var copy2 = original.makePrivate();
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
      var $__1;
      var $__2 = config,
          greet = ($__1 = $__2.greet) === void 0 ? 'Hello' : $__1;
      return (function(args, name) {
        return greet + ', ' + name;
      });
    }), 'text', 'text');
    var bundle1 = {};
    var copy1 = original.makePrivate(bundle1);
    var copy11 = original.makePrivate(bundle1);
    should.equal(copy1.id, copy11.id);
    should.equal(copy1, copy11);
    should.equal(Object.getPrototypeOf(copy1), original);
    var copy2 = original.makePrivate();
    should.equal(Object.getPrototypeOf(copy2), original);
    should.not.equal(original.id, copy1.id);
    should.not.equal(original.id, copy2.id);
    should.not.equal(copy1.id, copy2.id);
    var bundle2 = {};
    var copy21 = copy2.makePrivate(bundle2);
    var copy22 = copy2.makePrivate(bundle2);
    should.equal(copy21.id, copy22.id);
    should.equal(copy21, copy22);
    should.equal(Object.getPrototypeOf(copy21), original);
  }));
  it('nested privatize', (function() {
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
    var filter1 = filter.makePrivate();
    var filter2 = filter.makePrivate();
    should.not.equal(filter1.id, filter2.id);
    should.not.equal(filter1.transformComponent.id, filter2.transformComponent.id);
    var greet = simpleHandler((function(args, name) {
      return 'Hello, ' + name;
    }), 'text', 'text');
    var greet1 = greet.makePrivate().addMiddleware(filter1);
    var greet2 = greet.makePrivate().addMiddleware(filter1);
    var greet3 = greet.makePrivate().addMiddleware(filter2);
    var config = {transform: 'uppercase'};
    return greet1.loadHandler(config).then((function(handler) {
      return handler({}, 'John').should.eventually.equal('HELLO, JOHN');
    })).then((function() {
      config.transform = 'lowercase';
      return greet2.loadHandler(config).then((function(handler) {
        return handler({}, 'Bob').should.eventually.equal('HELLO, BOB');
      }));
    })).then((function() {
      config.transform = 'lowercase';
      return greet3.loadHandler(config).then((function(handler) {
        return handler({}, 'Alice').should.eventually.equal('hello, alice');
      }));
    }));
  }));
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
    var greet1 = greet.makePrivate(bundle1);
    var uppercase = transformCase.makePrivate(bundle1);
    var greet2 = greet.makePrivate(bundle2);
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
