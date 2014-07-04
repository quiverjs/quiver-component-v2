"use strict";
require('traceur');
var $__0 = $traceurRuntime.assertObject(require('../lib/export.js')),
    Router = $__0.Router,
    RouteList = $__0.RouteList,
    SimpleHandler = $__0.SimpleHandler,
    loadSimpleHandler = $__0.loadSimpleHandler,
    StaticRoute = $__0.StaticRoute,
    RegexRoute = $__0.RegexRoute,
    ParamRoute = $__0.ParamRoute;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
describe('router component test', (function() {
  it('static route', (function() {
    var handlerComponent = new SimpleHandler((function(args, input) {
      input.should.equal('hello');
      return 'goodbye';
    }), 'text', 'text');
    var router = new Router().addStaticRoute(handlerComponent, '/foo');
    return loadSimpleHandler({}, router, 'text', 'text').then((function(handler) {
      var p1 = handler({path: '/foo'}, 'hello').should.eventually.equal('goodbye');
      var p2 = handler({path: '/bar'}, 'nothing').should.be.rejected;
      return Promise.all([p1, p2]);
    }));
  }));
  it('regex route', (function() {
    var handlerComponent = new SimpleHandler((function(args, input) {
      input.should.equal('hello');
      return 'goodbye, ' + args.name;
    }), 'text', 'text');
    var router = new Router().addRegexRoute(handlerComponent, /^\/(\w+)$/, ['name']);
    return loadSimpleHandler({}, router, 'text', 'text').then((function(handler) {
      return handler({path: '/foo'}, 'hello').should.eventually.equal('goodbye, foo');
    }));
  }));
  it('param route', (function() {
    var greet = new SimpleHandler((function(args, input) {
      input.should.equal('hello');
      return 'goodbye, ' + args.name;
    }), 'text', 'text');
    var router = new Router().addParamRoute(greet, '/greet/:name');
    return loadSimpleHandler({}, router, 'text', 'text').then((function(handler) {
      return handler({path: '/greet/foo'}, 'hello').should.eventually.equal('goodbye, foo');
    }));
  }));
  it('route list', (function() {
    var foo = new SimpleHandler((function(args) {
      args.path.should.equal('/foo');
      return 'foo';
    }), 'void', 'text');
    var bar = new SimpleHandler((function(args) {
      args.path.should.equal('/subpath');
      args.id.should.equal('baz');
      return 'bar';
    }), 'void', 'text');
    var defaultPage = new SimpleHandler((function(args) {
      return 'default page';
    }), 'void', 'text');
    var routeList = new RouteList().addStaticRoute(foo, '/foo').addParamRoute(bar, '/bar/:id/:restpath');
    var router = new Router().addRouteList(routeList).setDefaultHandler(defaultPage);
    return loadSimpleHandler({}, router, 'void', 'text').then((function(handler) {
      var p1 = handler({path: '/foo'}).should.eventually.equal('foo');
      var p2 = handler({path: '/bar/baz/subpath'}).should.eventually.equal('bar');
      var p3 = handler({path: '/baz'}).should.eventually.equal('default page');
      return Promise.all([p1, p2, p3]);
    }));
  }));
  it('nested router', (function() {
    var post = new SimpleHandler((function(args, input) {
      args.userId.should.equal('john');
      args.postId.should.equal('welcome-to-my-blog');
      input.should.equal('some comment');
      return 'Hello World!';
    }), 'text', 'text');
    var defaultPage = new SimpleHandler((function(args) {
      return 'default page';
    }), 'void', 'text');
    var userRouter = new Router().addParamRoute(post, '/post/:postId');
    var mainRouter = new Router().addParamRoute(userRouter, '/user/:userId/:restpath').setDefaultHandler(defaultPage);
    return loadSimpleHandler({}, mainRouter, 'text', 'text').then((function(handler) {
      var path = '/user/john/post/welcome-to-my-blog';
      var p1 = handler({path: path}, 'some comment').should.eventually.equal('Hello World!');
      var p2 = handler({path: '/user/john/spam'}, 'spam').should.be.rejected;
      var p3 = handler({path: '/other place'}, 'nothing').should.eventually.equal('default page');
      return Promise.all([p1, p2, p3]);
    }));
  }));
}));
