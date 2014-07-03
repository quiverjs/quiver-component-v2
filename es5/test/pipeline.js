"use strict";
require('traceur');
var Pipeline = $traceurRuntime.assertObject(require('../lib/pipeline.js')).Pipeline;
var SimpleHandler = $traceurRuntime.assertObject(require('../lib/simple-handler.js')).SimpleHandler;
var loadSimpleHandler = $traceurRuntime.assertObject(require('../lib/util/loader.js')).loadSimpleHandler;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
describe.only('pipeline handler test', (function() {
  it('simple pipeline', (function() {
    var handler1 = (function(args) {
      return 'hello, ' + args.name;
    });
    var handler2 = (function(args, input) {
      return input.toUpperCase();
    });
    var handler3 = (function(args, input) {
      return ({
        status: 'ok',
        result: input
      });
    });
    var component1 = new SimpleHandler(handler1, 'void', 'text');
    var component2 = new SimpleHandler(handler2, 'text', 'text');
    var component3 = new SimpleHandler(handler3, 'text', 'json');
    var pipeline = new Pipeline([component1, component2, component3]);
    return loadSimpleHandler({}, pipeline, 'void', 'json').then((function(handler) {
      return handler({name: 'bob'}).then((function(result) {
        result.status.should.equal('ok');
        result.result.should.equal('HELLO, BOB');
      }));
    }));
  }));
}));
