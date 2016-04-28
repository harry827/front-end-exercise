(function (global, factory) {

    if (typeof module !== 'undefined' && typeof module.exports === 'object') {
        module.exports = factory;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () {
            return factory;
        });
    } else {
        global.jsonview = factory;
    }

})(window, function () {

    var DEFAULT_TAB = '&nbsp;&nbsp;';  // 默认tab空格

    /**
     *  main
     * @param data
     * @param success
     * @param error
     */
    function jsonview(data, success, error) {
        try {
            var jsonData = eval("(" + decodeURIComponent(data) + ")");
            var html = '<pre class="jsonview">';
            html += analyzeJson(jsonData);
            html += '</pre>';
            typeof success == 'function' && success(html);
        } catch (e) {
            typeof error == 'function' && error(e);
        }
    }

    /**
     * 计算object对象属性个数
     * @param obj
     * @returns {number}
     */
    function getObjSize(obj) {
        var size = 0;
        if (Object.keys) {
            size = Object.keys(obj).length;
        } else {
            for (var key in obj) {
                size++;
            }
        }

        return size;
    }

    /**
     * 解析json为html入口
     * @param obj
     * @param tab
     * @param isArray
     * @returns {*}
     */
    function analyzeJson(obj, tab, isArray) {
        var type = Object.prototype.toString.call(obj);
        tab = tab || '';
        var html = '';
        // 当前对象父元素为数组的时候添加缩进
        if (isArray) {
            html += tab;
        }

        switch (type) {
            case '[object Object]':
                html += analyzeObject(obj, tab, isArray);
                break;
            case '[object Array]':
                html += analyzeArray(obj, tab, isArray);
                break;
            case '[object String]':
                html += analyzeString(obj, tab, isArray);
                break;
            case '[object Number]':
                html += analyzeNumber(obj, tab, isArray);
                break;
            case '[object Boolean]':
                html += analyzeBoolen(obj, tab, isArray);
                break;
            default:
                html += analyzeNone(obj, tab, isArray);
                break;
        }

        return html;
    }

    /**
     * 解析对象为html
     *  比如：
     *      obj:{                   "obj": {
     *          a: 1,     ====>         "a": 1,
     *          b: 2                    "b": 2
     *      }                       }
     *
     *      obj:{}        ====>     "obj": {}
     *
     * @param obj
     * @param tab
     * @param isArray
     * @returns {string}
     */
    function analyzeObject(obj, tab, isArray) {
        var html = '';
        var len = getObjSize(obj);

        html += '<span class="jsonview-object">{</span>';
        //判断当对象为空的时候，不需要换行以及空格缩进
        if (len > 0) {
            html += '<br/>';
        }
        var objIndex = 0;
        for (var key in obj) {

            var value = obj[key];
            html += (tab + DEFAULT_TAB);
            html += '<span class="jsonview-key">"' + key + '"</span>';
            html += ': ';
            html += analyzeJson(value, (tab + DEFAULT_TAB));

            // 最后属性后面不应该存在’,‘
            if (objIndex < (len - 1)) {
                html += ',';
            }
            html += '<br/>';

            objIndex++;

        }
        //判断当对象为空的时候，不需要换行以及空格缩进
        if (len > 0) {
            html += tab;
        }
        html += '<span class="jsonview-object">}</span>';

        return html;
    }

    /**
     * 解析数组为html
     *  比如：
     *      arr:[1,2，{}]    ====>     "arr": [
     *                               1,
     *                               2,
     *                               {}
     *                             ]
     *
     *      arr:[]       ====>     "arr":[]
     *
     * @param obj
     * @param tab
     * @param isArray
     * @returns {string}
     */
    function analyzeArray(obj, tab, isArray) {
        var html = '';

        var i = 0,
            len = obj.length;

        html += '<span class="jsonview-array">[</span>';
        //判断当对象为空的时候，不需要换行以及空格缩进
        if (len > 0) {
            html += '<br/>';
        }
        for (; i < len; i++) {

            html += analyzeJson(obj[i], (tab + DEFAULT_TAB), true);
            // 最后一个元素后面不应该存在’,‘
            if (i < (len - 1)) {
                html += ',';
            }
            html += '<br/>';

        }
        //判断当对象为空的时候，不需要换行以及空格缩进
        if (len > 0) {
            html += tab;
        }
        html += '<span class="jsonview-array">]</span>';

        return html;
    }

    /**
     * 解析字符串格式为html
     * @param obj
     * @param tab
     * @param isArray
     * @returns {string}
     */
    function analyzeString(obj, tab, isArray) {
        return '<span class="jsonview-string">"' + obj + '"</span>';

    }

    /**
     * 解析数字格式为html
     * @param obj
     * @param tab
     * @param isArray
     * @returns {string}
     */
    function analyzeNumber(obj, tab, isArray) {
        return '<span class="jsonview-number">' + obj + '</span>';

    }

    /**
     * 解析Boolean为html
     * @param obj
     * @param tab
     * @param isArray
     * @returns {string}
     */
    function analyzeBoolen(obj, tab, isArray) {
        return '<span class="jsonview-boolean">' + obj + '</span>';
    }

    /**
     * 解析其他格式（null,undefined）为html
     * @param obj
     * @param tab
     * @param isArray
     * @returns {string}
     */
    function analyzeNone(obj, tab, isArray) {
        return '<span class="jsonview-none">' + obj + '</span>';
    }

    return jsonview;

}(this));