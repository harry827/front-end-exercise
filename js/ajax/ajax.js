(function (global, factory) {

    if (typeof module !== 'undefined' && typeof module.exports === 'object') {
        module.exports = factory;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () {
            return factory;
        });
    } else {
        global.zload = factory;
    }


})(typeof window !== "undefined" ? window : this, function (window) {
    var zload = {
        version: '0.0.1',
        // Ajax请求活跃数
        active: 0,
        // 默认配置
        settings: {
            // 默认请求类型
            type: 'GET',
            // 请求之前回调
            beforeSend: function () {
            },
            // 请求成功之后回调
            success: function () {
            },
            // 异常回调
            error: function () {
            },
            // 请求完成执行回调 (包括: error and success)
            complete: function () {
            },
            //所有callbacks的上下文
            context: null,
            // 是否触发全局("global")的Ajax事件
            global: true,
            // Transport
            xhr: function () {
                return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            },
            // MIME 类型映射
            accepts: {
                script: 'text/javascript, application/javascript',
                json: 'application/json',
                xml: 'application/xml, text/xml',
                html: 'text/html',
                text: 'text/plain'
            },
            // 该请求是否跨域
            crossDomain: false,
            // 超时时间
            timeout: 0
        }
    };

    /**
     * object extend
     * @param target
     * @param source
     * @returns {*}
     * @private
     */
    function _extend(target, source) {
        for (var key in source) {
            if (source[key] !== undefined) {
                target[key] = source[key];
            }
        }
        return target;
    }

    /**
     * 判断对象类型
     * @param obj
     * @returns {string}
     * @private
     */
    function _assertType(obj) {
        return Object.prototype.toString.call(obj);
    }

    /**
     * 拼接url和参数
     * @param url
     * @param query
     * @returns {string}
     * @private
     */
    function _concatQuery(url, query) {
        //  /[&?]{1,2}/ 将url后面 [?/?&/&?/&] 统一替换成"?"
        return (url + '&' + query).replace(/[&?]{1,2}/, '?');
    }

    /**
     * 序列化参数列表
     * @param params
     * @param obj
     * @param scope
     * @private
     */
    function _serialize(params, obj, scope) {


        var isArray = _assertType(obj) === '[object Array]';
        for (var key in obj) {
            var value = obj[key];
            if (scope) {
                key = scope + '[' + (isArray ? '' : key) + ']'; // a['b'][][...] = ...
            }

            if (!scope && isArray) {
                params.add(value.name, value.value);
            } else if (_assertType(value) === '[object Object]') {// 递归嵌套对象
                _serialize(params, value, key);
            } else {
                params.add(key, value);
            }
        }
    }

    /**
     * 参数处理
     * @param obj
     * @returns {string}
     * @private
     */
    function _param(obj) {
        var params = [];
        params.add = function (k, v) {
            this.push(encodeURIComponent(k) + '=' + encodeURIComponent(v))
        };
        _serialize(params, obj);

        return params.join('&').replace('%20', '+'); // %20 --> " "
    }

    /**
     * 序列化处理传递数据
     * @param options
     * @returns {*}
     * @private
     */
    function _serializeData(options) {
        if (_assertType(options.data) === '[object Object]') {
            options.data = _param(options.data);
        }
        if (options.data && options.type.toUpperCase() == 'GET') {
            options.url = _concatQuery(options.url, options.data);
        }

        return options;
    }

    /**
     * 根据请求头信息判断数据类型 mimeToType
     * @param mime
     * @returns {*|string|string}
     */
    var scriptRex = /^(?:text|application)\/javascript/i,
        xmlTypeRE = /^(?:text|application)\/xml/i;

    function mimeToType(mime) {
        return mime && ( mime == zload.settings['accepts']['html'] ? 'html' :
                mime == zload.settings['accepts']['json'] ? 'json' :
                    scriptRex.test(mime) ? 'script' :
                    xmlTypeRE.test(mime) && 'xml' ) || 'text';
    }

    var ajaxHandle = {
        jsonp_id: 0,
        /**
         * 验证是否跨域
         * @param settings
         * @returns {Array|{index: number, input: string}|boolean|*}
         */
        isCrossDomain: function (settings) {
            if (!settings.crossDomain) {
                // url = http://www.baidu.com/test --> ["http://www.baidu.com", "http:", "www.baidu.com"]
                var result = /^([\w-]+:)?\/\/([^\/]+)/.exec(settings.url);
                settings.crossDomain = result && result[2] != window.location.host;
            }
            return settings.crossDomain;
        },
        /**
         * 触发ajax全局事件
         * @param settings
         * @param context
         * @param eventName
         * @param data
         * @returns {boolean}
         */
        triggerGlobal: function (settings, context, eventName, data) {
            if (settings.global) {
                context = context || window;

                //var event = $.Event(eventName)
                //$(context).trigger(event, data)

                return true; //!event.defaultPrevented
            }
        },
        /**
         * 所有ajax开始之前执行
         * @param settings
         */
        start: function (settings) {
            if (settings.global && zload.active++ === 0) {
                this.triggerGlobal(settings, null, 'ajaxStart');
            }
        },
        /**
         * 请求发送之前执行
         * @param xhr
         * @param settings
         * @returns {boolean}
         */
        beforeSend: function (xhr, settings) {
            var context = settings.context;
            //
            if (settings.beforeSend.call(context, xhr, settings) === false || this.triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false) {
                return false;
            }
            // ajaxSend 请求发送前全局执行
            this.triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
        },
        /**
         * 请求成功回调
         * @param data
         * @param xhr
         * @param settings
         */
        success: function (data, xhr, settings) {
            var context = settings.context,
                status = 'success';

            settings.success.call(context, data, status, xhr);

            this.triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);

            this.complete(status, xhr, settings);
        },
        /**
         * 请求错误回调（比如type类型为: "timeout", "error", "abort", "parsererror"）
         * @param error
         * @param type
         * @param xhr
         * @param settings
         */
        error: function (error, type, xhr, settings) {
            var context = settings.context;

            settings.error.call(context, xhr, type, error);
            this.triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error]);
            this.complete(type, xhr, settings);

        },
        /**
         * 请求完成回调，在任何状态下（status: "success", "notmodified", "error", "timeout", "abort", "parser_error"）
         * @param status
         * @param xhr
         * @param settings
         */
        complete: function (status, xhr, settings) {
            //
            var context = settings.context;

            settings.complete.call(context, xhr, status);

            this.triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);
            this.stop(settings);
        },
        /**
         * ajax执行完后执行
         * @param settings
         */
        stop: function (settings) {
            if (settings.global && !(--zload.active)) {
                this.triggerGlobal(settings, null, 'ajaxStop');
            }
        }
    };

    /**
     * base ajax function
     *
     * @param options
     * @returns {*}
     */
    zload.ajax = function (options) {
        var _self = this;
        var settings = _extend(_self.settings, options || {});

        ajaxHandle.start(settings);

        // settings.crossDomain 验证
        ajaxHandle.isCrossDomain(settings);
        //跨域请求处理
        var dataType = settings.dataType,
            hasPlaceholder = /=\?/.test(settings.url); //是否有占位符，匹配"=?"(callback=?)
        if (dataType == 'jsonp' || hasPlaceholder) {
            // 验证是否存在callback占位符
            if (!hasPlaceholder) {
                settings.url = _concatQuery(settings.url, 'callback=?');
            }
            return zload.jsonp(settings);
        }

        //正常（非跨域）请求处理
        if (!settings.url) {
            settings.url = window.location.toString();
        }
        //序列化传递数据
        _serializeData(settings);
        //
        var mime = settings.accepts[dataType],
            baseHeaders = {},
            xhr = settings.xhr();

        var protocolRxp = /^([\w-]+:)\/\//.exec(settings.url),
            protocol = protocolRxp ? protocolRxp[1] : window.location.protocol;
        //请求头的X-Requested-With存在说明为ajax请求
        if (!settings.crossDomain) {
            baseHeaders['X-Requested-With'] = 'XMLHttpRequest';
        }
        //设置mime
        if (mime) {
            baseHeaders['Accept'] = mime;
            if (mime.indexOf(',') > -1) {
                mime = mime.split(',')[0];
            }
            /*
             overrideMimeType:覆盖发送给服务器的头部，强制 text/xml 作为 mime-type

             针对某些特定版本的mozillar浏览器的BUG进行修正,
             如果来自服务器的响应没有 XML mime-type 头部，则一些版本的 Mozilla 浏览器不能正常运行。
             */
            xhr.overrideMimeType && xhr.overrideMimeType(mime);
        }
        //设置头信息contentType
        if (settings.contentType || (settings.data && settings.type.toUpperCase() != 'GET')) {
            baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded');
        }
        //合并user设置的headers
        settings.headers = _extend(baseHeaders, settings.headers || {});

        var abortTimeout;
        xhr.onreadystatechange = function () {
            // 0: 请求未初始化，1: 服务器连接已建立,2: 请求已接收，3: 请求处理中,4: 请求已完成，且响应已就绪
            if (xhr.readyState == 4) {
                clearTimeout(abortTimeout);
                var result,
                    error = false;
                //
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
                    // getResponseHeader --> 从响应信息中获取指定的http头
                    dataType = dataType || mimeToType(xhr.getResponseHeader('content-type'));
                    result = xhr.responseText;

                    try {
                        if (dataType == 'script') {
                            eval(result);
                        } else if (dataType == 'xml') {
                            result = xhr.responseXML;
                        } else if (dataType == 'json') {
                            // 匹配0个或多个空白符（空格、换行、制表等符号）
                            result = /^\s*$/.test(result) ? null : JSON.parse(result);
                        }
                    } catch (e) {
                        error = e;
                    }

                    if (error) {
                        ajaxHandle.error(error, 'parser_error', xhr, settings);
                    } else {
                        ajaxHandle.success(result, xhr, settings);
                    }
                } else {
                    ajaxHandle.error(null, 'error', xhr, settings);
                }
            }
        }

        var async = 'async' in settings ? settings.async : true;
        //xhr.open(请求方式,请求地址,异步还是同步);
        xhr.open(settings.type, settings.url, async);
        //设置请求头
        for (var name in settings.headers) {
            xhr.setRequestHeader(name, settings.headers[name]);
        }

        if (ajaxHandle.beforeSend(xhr, settings) === false) {
            xhr.abort();
            return false;
        }

        if (settings.timeout > 0)
            abortTimeout = setTimeout(function () {
                xhr.onreadystatechange = function () {
                };
                xhr.abort();
                ajaxHandle.error(null, 'timeout', xhr, settings);
            }, settings.timeout);

        //避免发送空字符串
        xhr.send(settings.data ? settings.data : null);

        return xhr;

    };

    /**
     * 跨域请求处理
     * @param settings
     * @returns {{abort: Function}}
     */
    zload.jsonp = function (settings) {
        var callback_name = 'jsonp' + (ajaxHandle.jsonp_id++);
        var script = document.createElement('script'),
            xhr = {
                abort: function () {
                    //移除script
                    if (callback_name in window) {
                        window[callback_name] = function () {
                        };
                    }

                    ajaxHandle.complete('abort', xhr, settings);
                }
            },
            abortTimeout,
            head = document.getElementsByTagName("head")[0] || document.documentElement;

        if (settings.error) {
            script.onerror = function () {
                xhr.abort();
                settings.error();
            }
        }

        window[callback_name] = function (data) {
            // 请求成功后清除过期定时器
            clearTimeout(abortTimeout);
            // remove script
            delete window[callback_name];
            // 请求成功
            ajaxHandle.success(data, xhr, settings);
        };

        _serializeData(settings);
        // [/=\?/]匹配:'=?'
        script.src = settings.url.replace(/=\?/, '=' + callback_name);

        // 使用insertBefore来appendChild方法规避了IE6的bug。
        head.insertBefore(script, head.firstChild);
        // 超时
        if (settings.timeout > 0) {
            abortTimeout = setTimeout(function () {
                xhr.abort();
                ajaxHandle.complete('timeout', xhr, settings);
            }, settings.timeout);
        }

        return xhr;

    }

    /**
     * get请求
     * @param url
     * @param success
     * @returns {*}
     */
    zload.get = function (url, success) {
        return zload.ajax({url: url, success: success});
    }

    /**
     * post请求
     * @param url
     * @param data
     * @param success
     * @param dataType
     * @returns {*}
     */
    zload.post = function (url, data, success, dataType) {
        if (typeof data === 'function') {
            success = data;
            dataType = dataType || success;
            data = null;
        }
        return zload.ajax({type: 'POST', url: url, data: data, success: success, dataType: dataType});
    }

    /**
     * 返回值为json格式请求
     * @param url
     * @param success
     * @returns {*}
     */
    zload.getJSON = function (url, success) {
        return zload.ajax({url: url, success: success, dataType: 'json'});
    }


    return zload;

}(this));