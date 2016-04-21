(function (global, factory) {

    if (typeof module !== 'undefined' && typeof module.exports === 'object') {
        module.exports = factory;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () {
            return factory;
        });
    } else {
        global.zcookie = factory;
    }


})(typeof window !== "undefined" ? window : this, function (window) {

    var dayMilliseconds = 24 * 60 * 60 * 1000; // 一天的毫秒数

    function encode(str) {
        return encodeURIComponent(str);
    }

    function decode(str) {
        return decodeURIComponent(str);
    }

    function stringifyCookieValue(value) {
        if (typeof value == 'object') {
            value = JSON.stringify(value);
        }
        return encode(value);
    }

    function zcookie(key, value, options) {

        if (!key) {
            return;
        }
        // 写入cookie
        if (arguments.length > 1) {

            options = options || {};

            if (typeof options.expires === 'number') {
                var days = options.expires,
                    now = options.expires = new Date();
                now.setMilliseconds(now.getMilliseconds() + days * dayMilliseconds);
            }

            return document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '',
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join('');
        }

        //读取cookie
        var result = undefined,
            cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, len = cookies.length; i < len; i++) {
            var parts = cookies[i].split('='),
                name = decode(parts[0]),
                cookie = decode(parts[1]);

            if (key === name) {
                result = decode(cookie);
                break;
            }

        }

        return result;

    }

    return {
        version: '0.1.0',
        set: function () {
            return zcookie.apply(this, arguments);
        },
        get: function (key) {
            return zcookie(key);
        },
        remove: function (key, options) {
            options = options || {};
            options.expires = -1;
            zcookie(key, null, options);
            return !this.get(key);
        }
    };

}(this));