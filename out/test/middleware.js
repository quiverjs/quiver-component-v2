"use strict";
var $__traceur_64_0_46_0_46_8__,
    $__quiver_45_promise__,
    $___46__46__47_lib_47_export_46_js__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_8__ = require("traceur"), $__traceur_64_0_46_0_46_8__ && $__traceur_64_0_46_0_46_8__.__esModule && $__traceur_64_0_46_0_46_8__ || {default: $__traceur_64_0_46_0_46_8__});
var $__0 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    async = $__0.async,
    resolve = $__0.resolve,
    reject = $__0.reject;
var $__1 = ($___46__46__47_lib_47_export_46_js__ = require("../lib/export.js"), $___46__46__47_lib_47_export_46_js__ && $___46__46__47_lib_47_export_46_js__.__esModule && $___46__46__47_lib_47_export_46_js__ || {default: $___46__46__47_lib_47_export_46_js__}),
    simpleHandler = $__1.simpleHandler,
    simpleHandlerBuilder = $__1.simpleHandlerBuilder;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
let should = chai.should();
describe('middleware test', (function() {
  it('input handler', async(function*() {
    let uppercase = simpleHandler((function(args, input) {
      return input.toUpperCase() + '!';
    }), 'text', 'text');
    let main = simpleHandlerBuilder((function(config) {
      let inHandler = config.inHandler;
      should.exist(inHandler);
      return async(function*(args, input) {
        let result = yield inHandler(args, input);
        return {
          status: 'ok',
          result: result
        };
      });
    }), 'text', 'json').inputHandler(uppercase, 'inHandler');
    let handler = yield main.loadHandler({});
    let json = yield handler({}, 'hello');
    json.status.should.equal('ok');
    json.result.should.equal('HELLO!');
  }));
  it('config override', async(function*() {
    let main = simpleHandlerBuilder((function(config) {
      config.foo.should.equal('bar');
      return (function(args) {
        return 'hello';
      });
    }), 'void', 'text').configOverride({foo: 'bar'});
    let config = {foo: 'foo'};
    yield main.loadHandler(config);
  }));
  it('config alias', async(function*() {
    let main = simpleHandlerBuilder((function(config) {
      config.foo.should.equal('bar');
      return (function(args) {
        return 'hello';
      });
    }), 'void', 'text').configAlias({foo: 'bar'});
    let config = {bar: 'bar'};
    yield main.loadHandler(config);
  }));
}));
