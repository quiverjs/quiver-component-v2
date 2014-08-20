"use strict";
require('traceur');
var $__0 = $traceurRuntime.assertObject(require('../lib/export.js')),
    simpleHandler = $__0.simpleHandler,
    simpleHandlerBuilder = $__0.simpleHandlerBuilder,
    streamHandler = $__0.streamHandler,
    httpHandler = $__0.httpHandler,
    protocol = $__0.protocol,
    abstractComponent = $__0.abstractComponent;
var async = $traceurRuntime.assertObject(require('quiver-promise')).async;
var $__0 = $traceurRuntime.assertObject(require('quiver-stream-util')),
    streamableToText = $__0.streamableToText,
    emptyStreamable = $__0.emptyStreamable;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
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
  it('basic test', async($traceurRuntime.initGeneratorFunction(function $__1() {
    var impl,
        bundle,
        fooHandler,
        barHandler,
        $__2,
        $__3,
        $__4,
        $__5,
        $__6,
        $__7,
        $__8,
        $__9;
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
            $__2 = emptyStreamable();
            $__3 = barHandler({}, $__2);
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 10;
            return $__3;
          case 10:
            $__4 = $ctx.sent;
            $ctx.state = 12;
            break;
          case 12:
            $__5 = streamableToText($__4);
            $__6 = $__5.should;
            $__7 = $__6.eventually;
            $__8 = $__7.equal;
            $__9 = $__8.call($__7, 'Bar');
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 18;
            return $__9;
          case 18:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__1, this);
  })));
  it('sub protocol test', async($traceurRuntime.initGeneratorFunction(function $__10() {
    var bazProtocol,
        baz,
        impl,
        bundle,
        bazHandler,
        fooHandler,
        barHandler,
        $__11,
        $__12,
        $__13,
        $__14,
        $__15,
        $__16,
        $__17,
        $__18;
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
            $__11 = emptyStreamable();
            $__12 = barHandler({}, $__11);
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 10;
            return $__12;
          case 10:
            $__13 = $ctx.sent;
            $ctx.state = 12;
            break;
          case 12:
            $__14 = streamableToText($__13);
            $__15 = $__14.should;
            $__16 = $__15.eventually;
            $__17 = $__16.equal;
            $__18 = $__17.call($__16, 'Bar');
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 18;
            return $__18;
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
    }, $__10, this);
  })));
  it('astract component test', async($traceurRuntime.initGeneratorFunction(function $__19() {
    var abstractHandler,
        concrete,
        handler,
        result;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            abstractHandler = abstractComponent('inBundle', fooProtocol, simpleHandlerBuilder(async($traceurRuntime.initGeneratorFunction(function $__20(config) {
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
              }, $__20, this);
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
    }, $__19, this);
  })));
}));
