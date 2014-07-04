"use strict";
require('traceur');
var $__0 = $traceurRuntime.assertObject(require('../lib/export.js')),
    Pipeline = $__0.Pipeline,
    SimpleHandler = $__0.SimpleHandler,
    loadSimpleHandler = $__0.loadSimpleHandler;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
describe('pipeline handler test', (function() {
  it('simple pipeline', (function() {
    var component1 = new SimpleHandler((function(args) {
      return 'hello, ' + args.name;
    }), 'void', 'text');
    var component2 = new SimpleHandler((function(args, input) {
      return input.toUpperCase();
    }), 'text', 'text');
    var component3 = new SimpleHandler((function(args, input) {
      return ({
        status: 'ok',
        result: input
      });
    }), 'text', 'json');
    var pipeline = new Pipeline().addPipe(component1).addPipe(component2).addPipe(component3);
    return loadSimpleHandler({}, pipeline, 'void', 'json').then((function(handler) {
      return handler({name: 'bob'}).then((function(result) {
        result.status.should.equal('ok');
        result.result.should.equal('HELLO, BOB');
      }));
    }));
  }));
}));
