"use strict";
require('traceur');
var $__0 = $traceurRuntime.assertObject(require('../lib/router.js')),
    Router = $__0.Router,
    RouteList = $__0.RouteList;
var SimpleHandler = $traceurRuntime.assertObject(require('../lib/simple-handler.js')).SimpleHandler;
var loadSimpleHandler = $traceurRuntime.assertObject(require('../lib/util/loader.js')).loadSimpleHandler;
var $__0 = $traceurRuntime.assertObject(require('../lib/route.js')),
    StaticRoute = $__0.StaticRoute,
    RegexRoute = $__0.RegexRoute,
    ParamRoute = $__0.ParamRoute;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
describe.only('router component test', (function() {
  it('static route', (function() {
    var handler = (function(args, input) {
      input.should.equal('hello');
      return 'goodbye';
    });
    var handlerComponent = new SimpleHandler(handler, {
      inType: 'text',
      outType: 'text'
    });
    var route = new StaticRoute(handlerComponent, '/foo');
    var router = new Router();
    router.addRoute(route);
    var builder = router.handleableBuilder;
    return loadSimpleHandler({}, router, builder, {
      inType: 'text',
      outType: 'text'
    }).then((function(handler) {
      var p1 = handler({path: '/foo'}, 'hello').should.eventually.equal('goodbye');
      var p2 = handler({path: '/bar'}, 'nothing').should.be.rejected;
      return Promise.all([p1, p2]);
    }));
  }));
  it('regex route', (function() {
    var handler = (function(args, input) {
      input.should.equal('hello');
      return 'goodbye, ' + args.name;
    });
    var handlerComponent = new SimpleHandler(handler, {
      inType: 'text',
      outType: 'text'
    });
    var route = new RegexRoute(handlerComponent, /^\/(\w+)$/, ['name']);
    var router = new Router();
    router.addRoute(route);
    var builder = router.handleableBuilder;
    return loadSimpleHandler({}, router, builder, {
      inType: 'text',
      outType: 'text'
    }).then((function(handler) {
      return handler({path: '/foo'}, 'hello').should.eventually.equal('goodbye, foo');
    }));
  }));
  it('param route', (function() {
    var handler = (function(args, input) {
      input.should.equal('hello');
      return 'goodbye, ' + args.name;
    });
    var handlerComponent = new SimpleHandler(handler, {
      inType: 'text',
      outType: 'text'
    });
    var route = new ParamRoute(handlerComponent, '/:name');
    var router = new Router();
    router.addRoute(route);
    var builder = router.handleableBuilder;
    return loadSimpleHandler({}, router, builder, {
      inType: 'text',
      outType: 'text'
    }).then((function(handler) {
      return handler({path: '/foo'}, 'hello').should.eventually.equal('goodbye, foo');
    }));
  }));
}));
