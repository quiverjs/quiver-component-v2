"use strict";
var $__traceur_64_0_46_0_46_7__,
    $___46__46__47_lib_47_export_46_js__;
($__traceur_64_0_46_0_46_7__ = require("traceur"), $__traceur_64_0_46_0_46_7__ && $__traceur_64_0_46_0_46_7__.__esModule && $__traceur_64_0_46_0_46_7__ || {default: $__traceur_64_0_46_0_46_7__});
var $__0 = ($___46__46__47_lib_47_export_46_js__ = require("../lib/export.js"), $___46__46__47_lib_47_export_46_js__ && $___46__46__47_lib_47_export_46_js__.__esModule && $___46__46__47_lib_47_export_46_js__ || {default: $___46__46__47_lib_47_export_46_js__}),
    pipeline = $__0.pipeline,
    simpleHandler = $__0.simpleHandler,
    loadSimpleHandler = $__0.loadSimpleHandler;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
describe('pipeline handler test', (function() {
  it('simple pipeline', (function() {
    var handler1 = simpleHandler((function(args) {
      return 'hello, ' + args.name;
    }), 'void', 'text');
    var handler2 = simpleHandler((function(args, input) {
      return input.toUpperCase();
    }), 'text', 'text');
    var handler3 = simpleHandler((function(args, input) {
      return ({
        status: 'ok',
        result: input
      });
    }), 'text', 'json');
    var main = pipeline().addPipe(handler1).addPipe(handler2).addPipe(handler3);
    return loadSimpleHandler({}, main, 'void', 'json').then((function(handler) {
      return handler({name: 'bob'}).then((function(result) {
        result.status.should.equal('ok');
        result.result.should.equal('HELLO, BOB');
      }));
    }));
  }));
}));
