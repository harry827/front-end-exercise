/*! echo-js v1.7.3 | (c) 2016 @toddmotto | https://github.com/toddmotto/echo */

/**
 * 一个独立的不依赖任何第三方库的按需加载图片的工具。支持ie8+
 * 注：这插件不咋好使~~
 */

// 兼容AMD和CMD方式的按需加载方式
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.echo = factory(root);
    }
})(this, function (root) {

    'use strict';

    // 定义工具对象
    var echo = {};

    var callback = function () {
    };

    var offset, poll, delay, useDebounce, unload;

    // 判断dom元素是否隐藏
    /*
     offsetParent --> 返回一个对象的引用，这个对象是距离调用offsetParent的元素最近的（在包含层次中最靠近的），
     并且是已进行过CSS定位的容器元素。如果这个容器元素未进行CSS定位, 则offsetParent属性的取值为根元素(在标准兼容模式
     下为html元素；在怪异呈现模式下为body元素)的引用。
     当容器元素的style.display 被设置为 "none"时（译注：IE和Opera除外），offsetParent属性 返回 null。

     */
    var isHidden = function (element) {
        return (element.offsetParent === null);
    };

    // 判断dom元素是否在当前可视区域
    var inView = function (element, view) {
        if (isHidden(element)) {
            return false;
        }
        // getBoundingClientRect --> 这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离。
        var box = element.getBoundingClientRect();
        return (box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b);
    };

    var debounceOrThrottle = function () {
        if (!useDebounce && !!poll) {
            return;
        }
        clearTimeout(poll);
        poll = setTimeout(function () {
            echo.render();
            poll = null;
        }, delay);
    };

    /**
     * 初始化echo.js
     * options:
     *      1、offset: 默认: 0,
     *      2、offsetVertical: 默认: offset的值,
     *      3、offsetHorizontal: 默认: offset的值,
     *      4、offsetTop: 默认: offsetVertical的值,
     *      5、offsetBottom: 默认: offsetVertical的值,
     *      6、offsetLeft: 默认: offsetHorizontal的值,
     *      7、offsetRight: 默认: offsetHorizontal的值,
     *      8、throttle: 默认: 250,
     *      9、debounce: 默认: true,
     *      10、unload: 默认: false,
     *      11、callback: 默认: function(){}
     * @param opts
     */
    echo.init = function (opts) {
        opts = opts || {};
        var offsetAll = opts.offset || 0;
        var offsetVertical = opts.offsetVertical || offsetAll;
        var offsetHorizontal = opts.offsetHorizontal || offsetAll;
        // 取整数
        var optionToInt = function (opt, fallback) {
            return parseInt(opt || fallback, 10);
        };
        offset = {
            t: optionToInt(opts.offsetTop, offsetVertical),
            b: optionToInt(opts.offsetBottom, offsetVertical),
            l: optionToInt(opts.offsetLeft, offsetHorizontal),
            r: optionToInt(opts.offsetRight, offsetHorizontal)
        };
        delay = optionToInt(opts.throttle, 250);
        useDebounce = opts.debounce !== false;
        unload = !!opts.unload;
        callback = opts.callback || callback;

        echo.render();

        // 监听scroll事件和load事件
        if (document.addEventListener) {
            root.addEventListener('scroll', debounceOrThrottle, false);
            root.addEventListener('load', debounceOrThrottle, false);
        } else {
            root.attachEvent('onscroll', debounceOrThrottle);
            root.attachEvent('onload', debounceOrThrottle);
        }
    };

    echo.render = function () {
        var nodes = document.querySelectorAll('img[data-echo], [data-echo-background]');
        var length = nodes.length;
        var src, elem;
        var view = {
            l: 0 - offset.l,
            t: 0 - offset.t,
            b: (root.innerHeight || document.documentElement.clientHeight) + offset.b,
            r: (root.innerWidth || document.documentElement.clientWidth) + offset.r
        };
        // 遍历所有符合条件的dom元素
        for (var i = 0; i < length; i++) {
            elem = nodes[i];
            // 如果当前元素在视口内
            if (inView(elem, view)) {

                if (unload) {
                    elem.setAttribute('data-echo-placeholder', elem.src);
                }

                if (elem.getAttribute('data-echo-background') !== null) {
                    elem.style.backgroundImage = "url(" + elem.getAttribute('data-echo-background') + ")";
                }
                else {
                    elem.src = elem.getAttribute('data-echo');
                }

                if (!unload) {
                    elem.removeAttribute('data-echo');
                    elem.removeAttribute('data-echo-background');
                }

                // 每个图片加载进来后执行
                callback(elem, 'load');
            }
            // 不在视口内，并且存在data-echo-placeholder属性,显示帮助图片效果
            else if (unload && !!(src = elem.getAttribute('data-echo-placeholder'))) {

                if (elem.getAttribute('data-echo-background') !== null) {
                    elem.style.backgroundImage = "url(" + src + ")";
                }
                else {
                    elem.src = src;
                }

                elem.removeAttribute('data-echo-placeholder');

                // 每个图片加载进来后执行
                callback(elem, 'unload');
            }
        }

        if (!length) {
            echo.detach();
        }
    };

    // 取消scroll绑定函数，清空定时器事件
    echo.detach = function () {
        if (document.removeEventListener) {
            root.removeEventListener('scroll', debounceOrThrottle);
        } else {
            root.detachEvent('onscroll', debounceOrThrottle);
        }
        clearTimeout(poll);
    };

    return echo;

});
