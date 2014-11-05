"use strict";
var $__traceur_64_0_46_0_46_7__,
    $___46__46__47_lib_47_export_46_js__,
    $__quiver_45_promise__,
    $__quiver_45_stream_45_util__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_7__ = require("traceur"), $__traceur_64_0_46_0_46_7__ && $__traceur_64_0_46_0_46_7__.__esModule && $__traceur_64_0_46_0_46_7__ || {default: $__traceur_64_0_46_0_46_7__});
var $__0 = ($___46__46__47_lib_47_export_46_js__ = require("../lib/export.js"), $___46__46__47_lib_47_export_46_js__ && $___46__46__47_lib_47_export_46_js__.__esModule && $___46__46__47_lib_47_export_46_js__ || {default: $___46__46__47_lib_47_export_46_js__}),
    simpleHandler = $__0.simpleHandler,
    simpleHandlerBuilder = $__0.simpleHandlerBuilder,
    streamHandler = $__0.streamHandler,
    httpHandler = $__0.httpHandler,
    protocol = $__0.protocol,
    abstractComponent = $__0.abstractComponent;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var $__2 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    streamableToText = $__2.streamableToText,
    emptyStreamable = $__2.emptyStreamable;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
describe('protocol test', (function() {
  var fooProtocol = protocol().simpleHandler('foo', 'text', 'text').streamHandler('bar');
  var foo = simpleHandler((function(args, text) {
    return 'hello, ' + text;
  }), 'text', 'text');
  var bar = simpleHandler((function(args) {
    return 'Bar';
  }), 'void', 'text');
  it('basic test', async($traceurRuntime.initGeneratorFunction(function $__5() {
    var impl,
        bundle,
        fooHandler,
        barHandler,
        $__6,
        $__7,
        $__8,
        $__9,
        $__10,
        $__11,
        $__12,
        $__13;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            expect((function() {
              return fooProtocol.implement({foo: foo});
            })).to.throw();
            impl = fooProtocol.implement({
              foo: foo,
              bar: bar
            });
            $ctx.state = 22;
            break;
          case 22:
            $ctx.state = 2;
            return impl.loadHandlers({});
          case 2:
            bundle = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            fooHandler = bundle.foo;
            should.exist(fooHandler);
            barHandler = bundle.bar;
            should.exist(barHandler);
            $ctx.state = 24;
            break;
          case 24:
            $ctx.state = 6;
            return fooHandler({}, 'world').should.eventually.equal('hello, world');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = 8;
            break;
          case 8:
            $__6 = emptyStreamable();
            $__7 = barHandler({}, $__6);
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 10;
            return $__7;
          case 10:
            $__8 = $ctx.sent;
            $ctx.state = 12;
            break;
          case 12:
            $__9 = streamableToText($__8);
            $__10 = $__9.should;
            $__11 = $__10.eventually;
            $__12 = $__11.equal;
            $__13 = $__12.call($__11, 'Bar');
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 18;
            return $__13;
          case 18:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__5, this);
  })));
  it('sub protocol test', async($traceurRuntime.initGeneratorFunction(function $__14() {
    var bazProtocol,
        baz,
        impl,
        bundle,
        bazHandler,
        fooHandler,
        barHandler,
        $__15,
        $__16,
        $__17,
        $__18,
        $__19,
        $__20,
        $__21,
        $__22;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            bazProtocol = protocol().simpleHandler('baz', 'void', 'text').subprotocol(fooProtocol);
            baz = simpleHandler((function(args) {
              return 'Baz';
            }), 'void', 'text');
            impl = bazProtocol.implement({
              foo: foo,
              bar: bar,
              baz: baz
            });
            $ctx.state = 26;
            break;
          case 26:
            $ctx.state = 2;
            return impl.loadHandlers({});
          case 2:
            bundle = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            bazHandler = bundle.baz;
            should.exist(bazHandler);
            fooHandler = bundle.foo;
            should.exist(fooHandler);
            barHandler = bundle.bar;
            should.exist(barHandler);
            $ctx.state = 28;
            break;
          case 28:
            $ctx.state = 6;
            return fooHandler({}, 'world').should.eventually.equal('hello, world');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = 8;
            break;
          case 8:
            $__15 = emptyStreamable();
            $__16 = barHandler({}, $__15);
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 10;
            return $__16;
          case 10:
            $__17 = $ctx.sent;
            $ctx.state = 12;
            break;
          case 12:
            $__18 = streamableToText($__17);
            $__19 = $__18.should;
            $__20 = $__19.eventually;
            $__21 = $__20.equal;
            $__22 = $__21.call($__20, 'Bar');
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 18;
            return $__22;
          case 18:
            $ctx.maybeThrow();
            $ctx.state = 20;
            break;
          case 20:
            $ctx.state = 22;
            return bazHandler({}).should.eventually.equal('Baz');
          case 22:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__14, this);
  })));
  it('astract component test', async($traceurRuntime.initGeneratorFunction(function $__23() {
    var abstractHandler,
        concrete,
        handler,
        result;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            abstractHandler = abstractComponent('inBundle', fooProtocol, simpleHandlerBuilder(async($traceurRuntime.initGeneratorFunction(function $__24(config) {
              var inBundle,
                  fooHandler,
                  fooResult;
              return $traceurRuntime.createGeneratorInstance(function($ctx) {
                while (true)
                  switch ($ctx.state) {
                    case 0:
                      inBundle = config.inBundle;
                      should.exist(inBundle);
                      fooHandler = inBundle.foo;
                      should.exist(fooHandler);
                      $ctx.state = 8;
                      break;
                    case 8:
                      $ctx.state = 2;
                      return fooHandler({}, 'Foo');
                    case 2:
                      fooResult = $ctx.sent;
                      $ctx.state = 4;
                      break;
                    case 4:
                      fooResult.should.equal('hello, Foo');
                      $ctx.state = 10;
                      break;
                    case 10:
                      $ctx.returnValue = (function(args) {
                        return fooResult;
                      });
                      $ctx.state = -2;
                      break;
                    default:
                      return $ctx.end();
                  }
              }, $__24, this);
            })), 'void', 'text'));
            concrete = abstractHandler.implement({
              foo: foo,
              bar: bar
            }).concretize();
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 2;
            return concrete.loadHandler({});
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({});
          case 6:
            result = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            result.should.equal('hello, Foo');
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__23, this);
  })));
}));
