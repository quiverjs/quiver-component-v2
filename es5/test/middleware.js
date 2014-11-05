"use strict";
var $__traceur_64_0_46_0_46_7__,
    $__quiver_45_promise__,
    $___46__46__47_lib_47_export_46_js__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_7__ = require("traceur"), $__traceur_64_0_46_0_46_7__ && $__traceur_64_0_46_0_46_7__.__esModule && $__traceur_64_0_46_0_46_7__ || {default: $__traceur_64_0_46_0_46_7__});
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
var should = chai.should();
describe('middleware test', (function() {
  it('input handler', async($traceurRuntime.initGeneratorFunction(function $__4() {
    var uppercase,
        main,
        handler,
        json;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            uppercase = simpleHandler((function(args, input) {
              return input.toUpperCase() + '!';
            }), 'text', 'text');
            main = simpleHandlerBuilder((function(config) {
              var inHandler = config.inHandler;
              should.exist(inHandler);
              return async($traceurRuntime.initGeneratorFunction(function $__5(args, input) {
                var result;
                return $traceurRuntime.createGeneratorInstance(function($ctx) {
                  while (true)
                    switch ($ctx.state) {
                      case 0:
                        $ctx.state = 2;
                        return inHandler(args, input);
                      case 2:
                        result = $ctx.sent;
                        $ctx.state = 4;
                        break;
                      case 4:
                        $ctx.returnValue = {
                          status: 'ok',
                          result: result
                        };
                        $ctx.state = -2;
                        break;
                      default:
                        return $ctx.end();
                    }
                }, $__5, this);
              }));
            }), 'text', 'json').inputHandler(uppercase, 'inHandler');
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 2;
            return main.loadHandler({});
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({}, 'hello');
          case 6:
            json = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            json.status.should.equal('ok');
            json.result.should.equal('HELLO!');
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__4, this);
  })));
  it('config override', async($traceurRuntime.initGeneratorFunction(function $__5() {
    var main,
        config;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            main = simpleHandlerBuilder((function(config) {
              config.foo.should.equal('bar');
              return (function(args) {
                return 'hello';
              });
            }), 'void', 'text').configOverride({foo: 'bar'});
            config = {foo: 'foo'};
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return main.loadHandler(config);
          case 2:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__5, this);
  })));
  it('config alias', async($traceurRuntime.initGeneratorFunction(function $__6() {
    var main,
        config;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            main = simpleHandlerBuilder((function(config) {
              config.foo.should.equal('bar');
              return (function(args) {
                return 'hello';
              });
            }), 'void', 'text').configAlias({foo: 'bar'});
            config = {bar: 'bar'};
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return main.loadHandler(config);
          case 2:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__6, this);
  })));
}));
