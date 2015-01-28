"use strict";
var $__traceur_64_0_46_0_46_8__,
    $___46__46__47_lib_47_export_46_js__,
    $__quiver_45_promise__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_8__ = require("traceur"), $__traceur_64_0_46_0_46_8__ && $__traceur_64_0_46_0_46_8__.__esModule && $__traceur_64_0_46_0_46_8__ || {default: $__traceur_64_0_46_0_46_8__});
var $__0 = ($___46__46__47_lib_47_export_46_js__ = require("../lib/export.js"), $___46__46__47_lib_47_export_46_js__ && $___46__46__47_lib_47_export_46_js__.__esModule && $___46__46__47_lib_47_export_46_js__ || {default: $___46__46__47_lib_47_export_46_js__}),
    simpleHandlerBuilder = $__0.simpleHandlerBuilder,
    transformFilter = $__0.transformFilter,
    handlerBundle = $__0.handlerBundle;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
let should = chai.should();
describe('bundle component test', (function() {
  let bundle = handlerBundle((function(config) {
    let count = config.initial || 0;
    let getCount = (function(args) {
      return '' + count;
    });
    let increment = (function(args) {
      return ++count;
    });
    let decrement = (function(args) {
      return --count;
    });
    return {
      getCount: getCount,
      increment: increment,
      decrement: decrement
    };
  })).simpleHandler('getCount', 'void', 'text').simpleHandler('increment', 'void', 'void').simpleHandler('decrement', 'void', 'void');
  let $__4 = bundle.toHandlerComponents(),
      getCount = $__4.getCount,
      increment = $__4.increment,
      decrement = $__4.decrement;
  it('basic test', async(function*() {
    let config = {};
    let getCountHandler = yield getCount.loadHandler(config);
    let incrementHandler = yield increment.loadHandler(config);
    let decrementHandler = yield decrement.loadHandler(config);
    yield getCountHandler({}).should.eventually.equal('0');
    yield incrementHandler({});
    yield getCountHandler({}).should.eventually.equal('1');
    yield incrementHandler({});
    yield getCountHandler({}).should.eventually.equal('2');
    yield decrementHandler({});
    yield getCountHandler({}).should.eventually.equal('1');
    yield decrementHandler({});
    yield getCountHandler({}).should.eventually.equal('0');
  }));
  it('initialize test', async(function*() {
    let config = {initial: 2};
    let incrementHandler = yield increment.loadHandler(config);
    config.initial = 4;
    let getCountHandler = yield getCount.loadHandler(config);
    yield getCountHandler({}).should.eventually.equal('2');
  }));
  it('bundle fork test', async(function*() {
    let bundle2 = bundle.fork();
    let $__5 = bundle2.toHandlerComponents(),
        getCount2 = $__5.getCount,
        increment2 = $__5.increment;
    let config = {};
    let getCountHandler = yield getCount.loadHandler(config);
    let incrementHandler = yield increment.loadHandler(config);
    let getCountHandler2 = yield getCount2.loadHandler(config);
    let incrementHandler2 = yield increment2.loadHandler(config);
    yield getCountHandler({}).should.eventually.equal('0');
    yield getCountHandler2({}).should.eventually.equal('0');
    yield incrementHandler({});
    yield getCountHandler({}).should.eventually.equal('1');
    yield getCountHandler2({}).should.eventually.equal('0');
    yield incrementHandler({});
    yield getCountHandler({}).should.eventually.equal('2');
    yield getCountHandler2({}).should.eventually.equal('0');
    yield incrementHandler2({});
    yield getCountHandler({}).should.eventually.equal('2');
    yield getCountHandler2({}).should.eventually.equal('1');
  }));
  it('privatized test', async(function*() {
    let forkTable = {};
    let getCount2 = getCount.fork(forkTable);
    let increment2 = increment.fork(forkTable);
    let config = {};
    let getCountHandler = yield getCount.loadHandler(config);
    let incrementHandler = yield increment.loadHandler(config);
    let getCountHandler2 = yield getCount2.loadHandler(config);
    let incrementHandler2 = yield increment2.loadHandler(config);
    yield getCountHandler({}).should.eventually.equal('0');
    yield getCountHandler2({}).should.eventually.equal('0');
    yield incrementHandler({});
    yield getCountHandler({}).should.eventually.equal('1');
    yield getCountHandler2({}).should.eventually.equal('0');
    yield incrementHandler({});
    yield getCountHandler({}).should.eventually.equal('2');
    yield getCountHandler2({}).should.eventually.equal('0');
    yield incrementHandler2({});
    yield getCountHandler({}).should.eventually.equal('2');
    yield getCountHandler2({}).should.eventually.equal('1');
  }));
  it('forked middleware test', async(function*() {
    let prefixer = simpleHandlerBuilder((function(config) {
      let prefix = config.prefix || '';
      return (function(args, text) {
        return prefix + '-' + text;
      });
    }), 'text', 'text');
    let prefixFilter = transformFilter(prefixer, 'out');
    let bundle2 = bundle.fork();
    let $__5 = bundle2.toHandlerComponents(),
        getCount2 = $__5.getCount,
        increment2 = $__5.increment;
    getCount2.addMiddleware(prefixFilter);
    let forkTable = {};
    let getCount3 = getCount2.fork(forkTable);
    let increment3 = increment2.fork(forkTable);
    let config = {prefix: 'foo'};
    let getCountHandler2 = yield getCount2.loadHandler(config);
    let incrementHandler2 = yield increment2.loadHandler(config);
    config.prefix = 'bar';
    let getCountHandler3 = yield getCount3.loadHandler(config);
    let incrementHandler3 = yield increment3.loadHandler(config);
    yield getCountHandler2({}).should.eventually.equal('foo-0');
    yield getCountHandler3({}).should.eventually.equal('bar-0');
    yield incrementHandler2({});
    yield getCountHandler2({}).should.eventually.equal('foo-1');
    yield getCountHandler3({}).should.eventually.equal('bar-0');
    yield incrementHandler2({});
    yield getCountHandler2({}).should.eventually.equal('foo-2');
    yield getCountHandler3({}).should.eventually.equal('bar-0');
    yield incrementHandler3({});
    yield getCountHandler2({}).should.eventually.equal('foo-2');
    yield getCountHandler3({}).should.eventually.equal('bar-1');
  }));
}));
