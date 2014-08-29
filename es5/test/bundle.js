"use strict";
require('traceur');
var $__0 = $traceurRuntime.assertObject(require('../lib/export.js')),
    simpleHandlerBuilder = $__0.simpleHandlerBuilder,
    transformFilter = $__0.transformFilter,
    handlerBundle = $__0.handlerBundle;
var async = $traceurRuntime.assertObject(require('quiver-promise')).async;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
describe('bundle component test', (function() {
  var bundle = handlerBundle((function(config) {
    var count = config.initial || 0;
    var getCount = (function(args) {
      return '' + count;
    });
    var increment = (function(args) {
      return ++count;
    });
    var decrement = (function(args) {
      return --count;
    });
    return {
      getCount: getCount,
      increment: increment,
      decrement: decrement
    };
  })).simpleHandler('getCount', 'void', 'text').simpleHandler('increment', 'void', 'void').simpleHandler('decrement', 'void', 'void');
  var $__0 = $traceurRuntime.assertObject(bundle.handlerComponents),
      getCount = $__0.getCount,
      increment = $__0.increment,
      decrement = $__0.decrement;
  it('basic test', async($traceurRuntime.initGeneratorFunction(function $__1() {
    var config,
        getCountHandler,
        incrementHandler,
        decrementHandler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            config = {};
            $ctx.state = 50;
            break;
          case 50:
            $ctx.state = 2;
            return getCount.loadHandler(config);
          case 2:
            getCountHandler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return increment.loadHandler(config);
          case 6:
            incrementHandler = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 10;
            return decrement.loadHandler(config);
          case 10:
            decrementHandler = $ctx.sent;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.state = 14;
            return getCountHandler({}).should.eventually.equal('0');
          case 14:
            $ctx.maybeThrow();
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 18;
            return incrementHandler({});
          case 18:
            $ctx.maybeThrow();
            $ctx.state = 20;
            break;
          case 20:
            $ctx.state = 22;
            return getCountHandler({}).should.eventually.equal('1');
          case 22:
            $ctx.maybeThrow();
            $ctx.state = 24;
            break;
          case 24:
            $ctx.state = 26;
            return incrementHandler({});
          case 26:
            $ctx.maybeThrow();
            $ctx.state = 28;
            break;
          case 28:
            $ctx.state = 30;
            return getCountHandler({}).should.eventually.equal('2');
          case 30:
            $ctx.maybeThrow();
            $ctx.state = 32;
            break;
          case 32:
            $ctx.state = 34;
            return decrementHandler({});
          case 34:
            $ctx.maybeThrow();
            $ctx.state = 36;
            break;
          case 36:
            $ctx.state = 38;
            return getCountHandler({}).should.eventually.equal('1');
          case 38:
            $ctx.maybeThrow();
            $ctx.state = 40;
            break;
          case 40:
            $ctx.state = 42;
            return decrementHandler({});
          case 42:
            $ctx.maybeThrow();
            $ctx.state = 44;
            break;
          case 44:
            $ctx.state = 46;
            return getCountHandler({}).should.eventually.equal('0');
          case 46:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__1, this);
  })));
  it('initialize test', async($traceurRuntime.initGeneratorFunction(function $__2() {
    var config,
        incrementHandler,
        getCountHandler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            config = {initial: 2};
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 2;
            return increment.loadHandler(config);
          case 2:
            incrementHandler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            config.initial = 4;
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 6;
            return getCount.loadHandler(config);
          case 6:
            getCountHandler = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 10;
            return getCountHandler({}).should.eventually.equal('2');
          case 10:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__2, this);
  })));
  it('privatized bundle test', async($traceurRuntime.initGeneratorFunction(function $__3() {
    var bundle2,
        $__0,
        getCount2,
        increment2,
        config,
        getCountHandler,
        incrementHandler,
        getCountHandler2,
        incrementHandler2;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            bundle2 = bundle.makePrivate();
            $__0 = $traceurRuntime.assertObject(bundle2.handlerComponents), getCount2 = $__0.getCount, increment2 = $__0.increment;
            config = {};
            $ctx.state = 62;
            break;
          case 62:
            $ctx.state = 2;
            return getCount.loadHandler(config);
          case 2:
            getCountHandler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return increment.loadHandler(config);
          case 6:
            incrementHandler = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 10;
            return getCount2.loadHandler(config);
          case 10:
            getCountHandler2 = $ctx.sent;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.state = 14;
            return increment2.loadHandler(config);
          case 14:
            incrementHandler2 = $ctx.sent;
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 18;
            return getCountHandler({}).should.eventually.equal('0');
          case 18:
            $ctx.maybeThrow();
            $ctx.state = 20;
            break;
          case 20:
            $ctx.state = 22;
            return getCountHandler2({}).should.eventually.equal('0');
          case 22:
            $ctx.maybeThrow();
            $ctx.state = 24;
            break;
          case 24:
            $ctx.state = 26;
            return incrementHandler({});
          case 26:
            $ctx.maybeThrow();
            $ctx.state = 28;
            break;
          case 28:
            $ctx.state = 30;
            return getCountHandler({}).should.eventually.equal('1');
          case 30:
            $ctx.maybeThrow();
            $ctx.state = 32;
            break;
          case 32:
            $ctx.state = 34;
            return getCountHandler2({}).should.eventually.equal('0');
          case 34:
            $ctx.maybeThrow();
            $ctx.state = 36;
            break;
          case 36:
            $ctx.state = 38;
            return incrementHandler({});
          case 38:
            $ctx.maybeThrow();
            $ctx.state = 40;
            break;
          case 40:
            $ctx.state = 42;
            return getCountHandler({}).should.eventually.equal('2');
          case 42:
            $ctx.maybeThrow();
            $ctx.state = 44;
            break;
          case 44:
            $ctx.state = 46;
            return getCountHandler2({}).should.eventually.equal('0');
          case 46:
            $ctx.maybeThrow();
            $ctx.state = 48;
            break;
          case 48:
            $ctx.state = 50;
            return incrementHandler2({});
          case 50:
            $ctx.maybeThrow();
            $ctx.state = 52;
            break;
          case 52:
            $ctx.state = 54;
            return getCountHandler({}).should.eventually.equal('2');
          case 54:
            $ctx.maybeThrow();
            $ctx.state = 56;
            break;
          case 56:
            $ctx.state = 58;
            return getCountHandler2({}).should.eventually.equal('1');
          case 58:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__3, this);
  })));
  it('privatized test', async($traceurRuntime.initGeneratorFunction(function $__4() {
    var privateTable,
        getCount2,
        increment2,
        config,
        getCountHandler,
        incrementHandler,
        getCountHandler2,
        incrementHandler2;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            privateTable = {};
            getCount2 = getCount.makePrivate(privateTable);
            increment2 = increment.makePrivate(privateTable);
            config = {};
            $ctx.state = 62;
            break;
          case 62:
            $ctx.state = 2;
            return getCount.loadHandler(config);
          case 2:
            getCountHandler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return increment.loadHandler(config);
          case 6:
            incrementHandler = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 10;
            return getCount2.loadHandler(config);
          case 10:
            getCountHandler2 = $ctx.sent;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.state = 14;
            return increment2.loadHandler(config);
          case 14:
            incrementHandler2 = $ctx.sent;
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 18;
            return getCountHandler({}).should.eventually.equal('0');
          case 18:
            $ctx.maybeThrow();
            $ctx.state = 20;
            break;
          case 20:
            $ctx.state = 22;
            return getCountHandler2({}).should.eventually.equal('0');
          case 22:
            $ctx.maybeThrow();
            $ctx.state = 24;
            break;
          case 24:
            $ctx.state = 26;
            return incrementHandler({});
          case 26:
            $ctx.maybeThrow();
            $ctx.state = 28;
            break;
          case 28:
            $ctx.state = 30;
            return getCountHandler({}).should.eventually.equal('1');
          case 30:
            $ctx.maybeThrow();
            $ctx.state = 32;
            break;
          case 32:
            $ctx.state = 34;
            return getCountHandler2({}).should.eventually.equal('0');
          case 34:
            $ctx.maybeThrow();
            $ctx.state = 36;
            break;
          case 36:
            $ctx.state = 38;
            return incrementHandler({});
          case 38:
            $ctx.maybeThrow();
            $ctx.state = 40;
            break;
          case 40:
            $ctx.state = 42;
            return getCountHandler({}).should.eventually.equal('2');
          case 42:
            $ctx.maybeThrow();
            $ctx.state = 44;
            break;
          case 44:
            $ctx.state = 46;
            return getCountHandler2({}).should.eventually.equal('0');
          case 46:
            $ctx.maybeThrow();
            $ctx.state = 48;
            break;
          case 48:
            $ctx.state = 50;
            return incrementHandler2({});
          case 50:
            $ctx.maybeThrow();
            $ctx.state = 52;
            break;
          case 52:
            $ctx.state = 54;
            return getCountHandler({}).should.eventually.equal('2');
          case 54:
            $ctx.maybeThrow();
            $ctx.state = 56;
            break;
          case 56:
            $ctx.state = 58;
            return getCountHandler2({}).should.eventually.equal('1');
          case 58:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__4, this);
  })));
  it('privatized middleware test', async($traceurRuntime.initGeneratorFunction(function $__5() {
    var prefixer,
        prefixFilter,
        bundle2,
        $__0,
        getCount2,
        increment2,
        bundle3,
        getCount3,
        increment3,
        config,
        getCountHandler2,
        incrementHandler2,
        getCountHandler3,
        incrementHandler3;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            prefixer = simpleHandlerBuilder((function(config) {
              var prefix = config.prefix || '';
              return (function(args, text) {
                return prefix + '-' + text;
              });
            }), 'text', 'text');
            prefixFilter = transformFilter(prefixer, 'out');
            bundle2 = bundle.makePrivate();
            $__0 = $traceurRuntime.assertObject(bundle2.handlerComponents), getCount2 = $__0.getCount, increment2 = $__0.increment;
            getCount2.addMiddleware(prefixFilter);
            bundle3 = bundle2.makePrivate();
            $__0 = $traceurRuntime.assertObject(bundle3.handlerComponents), getCount3 = $__0.getCount, increment3 = $__0.increment;
            config = {prefix: 'foo'};
            $ctx.state = 62;
            break;
          case 62:
            $ctx.state = 2;
            return getCount2.loadHandler(config);
          case 2:
            getCountHandler2 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return increment2.loadHandler(config);
          case 6:
            incrementHandler2 = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            config.prefix = 'bar';
            $ctx.state = 64;
            break;
          case 64:
            $ctx.state = 10;
            return getCount3.loadHandler(config);
          case 10:
            getCountHandler3 = $ctx.sent;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.state = 14;
            return increment3.loadHandler(config);
          case 14:
            incrementHandler3 = $ctx.sent;
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 18;
            return getCountHandler2({}).should.eventually.equal('foo-0');
          case 18:
            $ctx.maybeThrow();
            $ctx.state = 20;
            break;
          case 20:
            $ctx.state = 22;
            return getCountHandler3({}).should.eventually.equal('bar-0');
          case 22:
            $ctx.maybeThrow();
            $ctx.state = 24;
            break;
          case 24:
            $ctx.state = 26;
            return incrementHandler2({});
          case 26:
            $ctx.maybeThrow();
            $ctx.state = 28;
            break;
          case 28:
            $ctx.state = 30;
            return getCountHandler2({}).should.eventually.equal('foo-1');
          case 30:
            $ctx.maybeThrow();
            $ctx.state = 32;
            break;
          case 32:
            $ctx.state = 34;
            return getCountHandler3({}).should.eventually.equal('bar-0');
          case 34:
            $ctx.maybeThrow();
            $ctx.state = 36;
            break;
          case 36:
            $ctx.state = 38;
            return incrementHandler2({});
          case 38:
            $ctx.maybeThrow();
            $ctx.state = 40;
            break;
          case 40:
            $ctx.state = 42;
            return getCountHandler2({}).should.eventually.equal('foo-2');
          case 42:
            $ctx.maybeThrow();
            $ctx.state = 44;
            break;
          case 44:
            $ctx.state = 46;
            return getCountHandler3({}).should.eventually.equal('bar-0');
          case 46:
            $ctx.maybeThrow();
            $ctx.state = 48;
            break;
          case 48:
            $ctx.state = 50;
            return incrementHandler3({});
          case 50:
            $ctx.maybeThrow();
            $ctx.state = 52;
            break;
          case 52:
            $ctx.state = 54;
            return getCountHandler2({}).should.eventually.equal('foo-2');
          case 54:
            $ctx.maybeThrow();
            $ctx.state = 56;
            break;
          case 56:
            $ctx.state = 58;
            return getCountHandler3({}).should.eventually.equal('bar-1');
          case 58:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__5, this);
  })));
}));