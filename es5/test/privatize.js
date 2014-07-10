"use strict";
require('traceur');
var SimpleHandlerBuilder = $traceurRuntime.assertObject(require('../lib/export.js')).SimpleHandlerBuilder;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
describe.only('privatized component test', (function() {
  it('single component test', (function() {
    var original = new SimpleHandlerBuilder((function(config) {
      var $__1;
      var $__0 = $traceurRuntime.assertObject(config),
          greet = ($__1 = $__0.greet) === void 0 ? 'Hello' : $__1;
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
    var original = new SimpleHandlerBuilder((function(config) {
      var $__1;
      var $__0 = $traceurRuntime.assertObject(config),
          greet = ($__1 = $__0.greet) === void 0 ? 'Hello' : $__1;
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
}));
