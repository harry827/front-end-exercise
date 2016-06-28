/*!
 * connect
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies. 模块依赖
 * @private
 */

var debug = require('debug')('connect:dispatcher');
var EventEmitter = require('events').EventEmitter;
var finalhandler = require('finalhandler');
var http = require('http');
var merge = require('utils-merge');
var parseUrl = require('parseurl');

/**
 * Module exports.
 * @public
 */

module.exports = createServer;

/**
 * Module variables. 变量
 * @private
 */

var env = process.env.NODE_ENV || 'development';
var proto = {};

/* istanbul ignore next */
var defer = typeof setImmediate === 'function'
    ? setImmediate
    : function (fn) {
    process.nextTick(fn.bind.apply(fn, arguments))
}

/**
 * Create a new connect server. 创建一个新的connect服务
 *
 * @return {function}
 * @public
 */

/*
 返回一个app函数，将会作为http.createServer的callback函数去行程一个httpServer的实例，
 其中app函数继承了proto对象和EventEmitter.prototype的方法,
 并且app为app函数添加两个属性：
 route：表示请求路径
 stack：存放所有中间件的容器
 */

function createServer() {
    function app(req, res, next) {
        app.handle(req, res, next);
    }

    // 将proto和EventEmitter.prototype的方法merge到app上
    merge(app, proto);
    merge(app, EventEmitter.prototype);
    app.route = '/';
    app.stack = [];
    return app;
}

/**
 * Utilize the given middleware `handle` to the given `route`,
 * defaulting to _/_. This "route" is the mount-point for the
 * middleware, when given a value other than _/_ the middleware
 * is only effective when that segment is present in the request's
 * pathname.
 *
 * For example if we were to mount a function at _/admin_, it would
 * be invoked on _/admin_, and _/admin/settings_, however it would
 * not be invoked for _/_, or _/posts_.
 *
 * @param {String|Function|Server} route, callback or server
 * @param {Function|Server} callback or server
 * @return {Server} for chaining
 * @public
 */

/*
 添加中间件方法：
 将中间件格式化成：{route: route , handle : fn}的形式push到stacksh数组中，
 其中route默认为“/”


 */
proto.use = function use(route, fn) {
    var handle = fn;
    var path = route;

    // 如果第一个参数不是字符串，则路由默认为"/"
    if (typeof route !== 'string') {
        handle = route;
        path = '/';
    }

    //如果fn为一个connect的app的实例，则将其自身handle方法的包裹给fn
    if (typeof handle.handle === 'function') {
        var server = handle;
        server.route = path;
        handle = function (req, res, next) {
            server.handle(req, res, next);
        };
    }

    // 如果fn为一个http.Server实例，则fn为其request事件的第一个监听器(http.createServer的callback函数)
    if (handle instanceof http.Server) {
        handle = handle.listeners('request')[0];
    }

    //如果route参数的以"/"结尾，则删除"/"
    if (path[path.length - 1] === '/') {
        path = path.slice(0, -1);
    }

    // add the middleware 添加这个中间件
    debug('use %s %s', path || '/', handle.name || 'anonymous');
    this.stack.push({route: path, handle: handle});

    return this;
};

/**
 * Handle server requests, punting them down
 * the middleware stack.
 *
 * @private
 */
/*
 根据请求路径route匹配执行对应的中间件，
 */
proto.handle = function handle(req, res, out) {

    var index = 0;
    var protohost = getProtohost(req.url) || '';
    var removed = ''; // 存储上个中间件的路由
    var slashAdded = false; // 是否添加了斜线
    var stack = this.stack;

    // final function handler 最后的处理方法
    //若含有next（第三个）参数,则继续调用，若无，则使用finalhandler库，作为请求最后的处理函数，若有err则抛出，否则则报404
    var done = out || finalhandler(req, res, {
            env: env,
            onerror: logerror
        });

    // store the original URL 记录原来的url
    req.originalUrl = req.originalUrl || req.url;

    function next(err) {
        // 去掉url开头的'/'
        if (slashAdded) {
            req.url = req.url.substr(1);
            slashAdded = false;
        }
        // 如果removed不为空，那么将url拼接完整
        if (removed.length !== 0) {
            req.url = protohost + removed + req.url.substr(protohost.length);
            removed = '';
        }

        // next callback 获取当前中间件，index + 1
        var layer = stack[index++];

        // all done  没有更多的中间件执行结束函数
        if (!layer) {
            defer(done, err);
            return;
        }

        // route data 路由操作
        var path = parseUrl(req).pathname || '/';
        var route = layer.route;

        // skip this layer if the route doesn't match
        // 查看当前请求路由是否匹配route,只匹配route长度的字符串，如"/foo/bar"与"/foo"是匹配的
        if (path.toLowerCase().substr(0, route.length) !== route.toLowerCase()) {
            return next(err);
        }

        // skip if route match does not border "/", ".", or end
        // 如果设置的路由不以'/'与‘.’结尾,或已结束，则报错(即上一个if保证了开头匹配，这里保证了结尾匹配)
        var c = path[route.length];
        if (c !== undefined && '/' !== c && '.' !== c) {
            return next(err);
        }

        // trim off the part of the url that matches the route
        //将request.url设置成与route不匹配的其他部分
        if (route.length !== 0 && route !== '/') {
            removed = route;
            req.url = protohost + req.url.substr(protohost.length + removed.length);
            // ensure leading slash
            // 保证路径以"/"开头
            if (!protohost && req.url[0] !== '/') {
                req.url = '/' + req.url;
                slashAdded = true;
            }
        }

        // call the layer handle
        //调用call函数执行layer
        call(layer.handle, route, err, req, res, next);
    }

    next();
};

/**
 * Listen for connections.
 *
 * This method takes the same arguments
 * as node's `http.Server#listen()`.
 *
 * HTTP and HTTPS:
 *
 * If you run your application both as HTTP
 * and HTTPS you may wrap them individually,
 * since your Connect "server" is really just
 * a JavaScript `Function`.
 *
 *      var connect = require('connect')
 *        , http = require('http')
 *        , https = require('https');
 *
 *      var app = connect();
 *
 *      http.createServer(app).listen(80);
 *      https.createServer(options, app).listen(443);
 *
 * @return {http.Server}
 * @api public
 */

/*
 创建app应用为一个httpServer实例
 */
proto.listen = function listen() {
    var server = http.createServer(this);
    return server.listen.apply(server, arguments);
};

/**
 * Invoke a route handle. 调用路由处理器
 * @private
 */
/*
 执行handle中匹配到的中间件
 */
function call(handle, route, err, req, res, next) {
    var arity = handle.length;
    var error = err;
    //是否有错
    var hasError = Boolean(err);

    debug('%s %s : %s', handle.name || '<anonymous>', route, req.originalUrl);

    try {
        // 执行错误中间件
        if (hasError && arity === 4) {
            // error-handling middleware
            handle(err, req, res, next);
            return;
        } else if (!hasError && arity < 4) {
            // request-handling middleware
            handle(req, res, next);
            return;
        }
    } catch (e) {
        // replace the error
        error = e;
    }

    // continue
    next(error);
}

/**
 * Log error using console.error. 使用console.error打印错误日志
 *
 * @param {Error} err
 * @private
 */

function logerror(err) {
    if (env !== 'test') console.error(err.stack || err.toString());
}

/**
 * Get get protocol + host for a URL.
 * 获取URL中的 protocol + host，比如：
 * https://www.npmjs.com/package/connect?a=111 ==> https://www.npmjs.com
 *
 * @param {string} url
 * @private
 */

function getProtohost(url) {
    // 长度为0或者开头为'/'（不是以http/https开头）
    if (url.length === 0 || url[0] === '/') {
        return undefined;
    }
    // req中"?"字符的位置索引，用来判断是否有query string
    var searchIndex = url.indexOf('?');
    // 获取url的长度（除去query string）
    var pathLength = searchIndex !== -1
        ? searchIndex
        : url.length;
    // 获取"://"字符串的位置索引
    var fqdnIndex = url.substr(0, pathLength).indexOf('://');

    return fqdnIndex !== -1
        ? url.substr(0, url.indexOf('/', 3 + fqdnIndex))
        : undefined;
}
