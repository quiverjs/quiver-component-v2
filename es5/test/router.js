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
describe('router component test', (function() {
  it('static route', (function() {
    var handler = (function(args, input) {
      input.should.equal('hello');
      return 'goodbye';
    });
    var handlerComponent = new SimpleHandler(handler, 'text', 'text');
    var route = new StaticRoute(handlerComponent, '/foo');
    var router = new Router();
    router.addRoute(route);
    return loadSimpleHandler({}, router, 'text', 'text').then((function(handler) {
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
    var handlerComponent = new SimpleHandler(handler, 'text', 'text');
    var route = new RegexRoute(handlerComponent, /^\/(\w+)$/, ['name']);
    var router = new Router();
    router.addRoute(route);
    return loadSimpleHandler({}, router, 'text', 'text').then((function(handler) {
      return handler({path: '/foo'}, 'hello').should.eventually.equal('goodbye, foo');
    }));
  }));
  it('param route', (function() {
    var handler = (function(args, input) {
      input.should.equal('hello');
      return 'goodbye, ' + args.name;
    });
    var handlerComponent = new SimpleHandler(handler, 'text', 'text');
    var route = new ParamRoute(handlerComponent, '/:name');
    var router = new Router();
    router.addRoute(route);
    return loadSimpleHandler({}, router, 'text', 'text').then((function(handler) {
      return handler({path: '/foo'}, 'hello').should.eventually.equal('goodbye, foo');
    }));
  }));
  it('route list', (function() {
    var fooHandler = (function(args) {
      args.path.should.equal('/foo');
      return 'foo';
    });
    var fooComponent = new SimpleHandler(fooHandler, 'void', 'text');
    var fooRoute = new StaticRoute(fooComponent, '/foo');
    var barHandler = (function(args) {
      args.path.should.equal('/subpath');
      args.id.should.equal('baz');
      return 'bar';
    });
    var barComponent = new SimpleHandler(barHandler, 'void', 'text');
    var barRoute = new ParamRoute(barComponent, '/bar/:id/:restpath');
    var defaultHandler = (function(args) {
      return 'default route';
    });
    var defaultComponent = new SimpleHandler(defaultHandler, 'void', 'text');
    var routeList = new RouteList([fooRoute, barRoute]);
    var router = new Router([routeList]);
    router.setDefaultHandler(defaultComponent);
    return loadSimpleHandler({}, router, 'void', 'text').then((function(handler) {
      var p1 = handler({path: '/foo'}).should.eventually.equal('foo');
      var p2 = handler({path: '/bar/baz/subpath'}).should.eventually.equal('bar');
      var p3 = handler({path: '/baz'}).should.eventually.equal('default route');
      return Promise.all([p1, p2, p3]);
    }));
  }));
  it('nested router', (function() {
    var postHandler = (function(args, input) {
      args.userId.should.equal('john');
      args.postId.should.equal('welcome-to-my-blog');
      input.should.equal('some comment');
      return 'Hello World!';
    });
    var postComponent = new SimpleHandler(postHandler, 'text', 'text');
    var postRoute = new ParamRoute(postComponent, '/post/:postId');
    var userRouter = new Router();
    userRouter.addRoute(postRoute);
    var userRoute = new ParamRoute(userRouter, '/user/:userId/:restpath');
    var defaultHandler = (function(args) {
      return 'default route';
    });
    var defaultComponent = new SimpleHandler(defaultHandler, 'void', 'text');
    var mainRouter = new Router();
    mainRouter.addRoute(userRoute);
    mainRouter.setDefaultHandler(defaultComponent);
    return loadSimpleHandler({}, mainRouter, 'text', 'text').then((function(handler) {
      var path = '/user/john/post/welcome-to-my-blog';
      var p1 = handler({path: path}, 'some comment').should.eventually.equal('Hello World!');
      var p2 = handler({path: '/user/john/spam'}, 'spam').should.be.rejected;
      var p3 = handler({path: '/other place'}, 'nothing').should.eventually.equal('default routes');
      return Promise.all([p1, p2, p3]);
    }));
  }));
}));
