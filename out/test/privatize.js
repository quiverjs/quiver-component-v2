"use strict";
var $__traceur_64_0_46_0_46_8__,
    $__quiver_45_promise__,
    $___46__46__47_lib_47_export_46_js__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_8__ = require("traceur"), $__traceur_64_0_46_0_46_8__ && $__traceur_64_0_46_0_46_8__.__esModule && $__traceur_64_0_46_0_46_8__ || {default: $__traceur_64_0_46_0_46_8__});
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var $__1 = ($___46__46__47_lib_47_export_46_js__ = require("../lib/export.js"), $___46__46__47_lib_47_export_46_js__ && $___46__46__47_lib_47_export_46_js__.__esModule && $___46__46__47_lib_47_export_46_js__ || {default: $___46__46__47_lib_47_export_46_js__}),
    simpleHandlerBuilder = $__1.simpleHandlerBuilder,
    simpleHandler = $__1.simpleHandler,
    transformFilter = $__1.transformFilter;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
let should = chai.should();
describe('privatized component test', (function() {
  it('single component test', (function() {
    let original = simpleHandlerBuilder((function(config) {
      var $__5;
      let $__4 = config,
          greet = ($__5 = $__4.greet) === void 0 ? 'Hello' : $__5;
      return (function(args, name) {
        return greet + ', ' + name;
      });
    }), 'text', 'text');
    let copy1 = original.fork();
    let copy2 = original.fork();
    should.equal(Object.getPrototypeOf(copy1), original);
    should.equal(Object.getPrototypeOf(copy2), original);
    should.not.equal(original.id, copy1.id);
    should.not.equal(original.id, copy2.id);
    should.not.equal(copy1.id, copy2.id);
    let config = {greet: 'Hi'};
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
    let original = simpleHandlerBuilder((function(config) {
      var $__5;
      let $__4 = config,
          greet = ($__5 = $__4.greet) === void 0 ? 'Hello' : $__5;
      return (function(args, name) {
        return greet + ', ' + name;
      });
    }), 'text', 'text');
    let bundle1 = {};
    let copy1 = original.fork(bundle1);
    let copy11 = original.fork(bundle1);
    should.equal(copy1.id, copy11.id);
    should.equal(copy1, copy11);
    should.equal(Object.getPrototypeOf(copy1), original);
    let copy2 = original.fork();
    should.equal(Object.getPrototypeOf(copy2), original);
    should.not.equal(original.id, copy1.id);
    should.not.equal(original.id, copy2.id);
    should.not.equal(copy1.id, copy2.id);
    let bundle2 = {};
    let copy21 = copy2.fork(bundle2);
    let copy22 = copy2.fork(bundle2);
    should.equal(copy21.id, copy22.id);
    should.equal(copy21, copy22);
    should.equal(Object.getPrototypeOf(copy21), copy2);
  }));
  it('nested privatize', async(function*() {
    let transformCase = simpleHandlerBuilder((function(config) {
      let transform = config.transform;
      let doTransform = transform == 'uppercase' ? (function(string) {
        return string.toUpperCase();
      }) : (function(string) {
        return string.toLowerCase();
      });
      return (function(args, text) {
        return doTransform(text);
      });
    }), 'text', 'text');
    let filter = transformFilter(transformCase, 'out');
    let filter1 = filter.fork();
    let filter2 = filter.fork();
    should.not.equal(filter1.id, filter2.id);
    should.not.equal(filter1.transformComponent.id, filter2.transformComponent.id);
    let greet = simpleHandler((function(args, name) {
      return 'Hello, ' + name;
    }), 'text', 'text');
    let greet1 = greet.fork().addMiddleware(filter1);
    let greet2 = greet.fork().addMiddleware(filter1);
    let greet3 = greet.fork().addMiddleware(filter2);
    let config = {transform: 'uppercase'};
    let handler = yield greet1.loadHandler(config);
    yield handler({}, 'John').should.eventually.equal('HELLO, JOHN');
    config.transform = 'lowercase';
    handler = yield greet2.loadHandler(config);
    yield handler({}, 'Bob').should.eventually.equal('HELLO, BOB');
    config.transform = 'lowercase';
    handler = yield greet3.loadHandler(config);
    yield handler({}, 'Alice').should.eventually.equal('hello, alice');
  }));
  it('privatized middlewares', async(function*() {
    let transformCase = simpleHandlerBuilder((function(config) {
      let transform = config.transform;
      let doTransform = transform == 'uppercase' ? (function(string) {
        return string.toUpperCase();
      }) : (function(string) {
        return string.toLowerCase();
      });
      return (function(args, text) {
        return doTransform(text);
      });
    }), 'text', 'text');
    let filter = transformFilter(transformCase, 'out');
    let greet = simpleHandler((function(args, name) {
      return 'Hello, ' + name;
    }), 'text', 'text').addMiddleware(filter);
    let bundle1 = {};
    let bundle2 = {};
    let greet1 = greet.fork(bundle1);
    let uppercase = transformCase.fork(bundle1);
    let greet2 = greet.fork(bundle2);
    let config = {transform: 'uppercase'};
    let handler = yield uppercase.loadHandler(config);
    yield handler({}, 'Test').should.eventually.equal('TEST');
    config.transform = 'lowercase';
    handler = yield greet1.loadHandler(config);
    yield handler({}, 'Alice').should.eventually.equal('HELLO, ALICE');
    config.transform = 'lowercase';
    handler = yield greet2.loadHandler(config);
    yield handler({}, 'Bob').should.eventually.equal('hello, bob');
  }));
}));
