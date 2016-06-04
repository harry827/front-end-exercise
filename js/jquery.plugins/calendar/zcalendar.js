(function ($) {
    /**
     * 扩展对象属性
     * @param target
     * @param source
     * @returns {*}
     */
    function _extend(target, source) {
        for (var property in source) {
            target[property] = source[property];
        }
        return target;
    }

    /**
     * 判断年份是否为闰年：四年一闰，百年不闰，四百年再闰
     * @param year
     * @returns {boolean}
     */
    function isLeapYear(year) {
        return ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0));
    }

    /**
     * 获取某年，某月的天数
     * @param year
     * @param month
     * @returns {number}
     */
    function getMonthDays(year, month) {
        var monthDays = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return monthDays[month];
    }

    /**
     * 返回某月的所有日期排布列表
     * @param year
     * @param month
     * @returns {Array}
     */
    function getMonthList(year, month) {
        var list = [];
        var firstDate = new Date(year, month, 1);
        var firstWeek = firstDate.getDay();
        var days = getMonthDays(year, month);

        // 补全开头空日期
        list[0] = [];
        for (var j = 0; j < firstWeek; j++) {
            list[0].push('');
        }
        for (var i = 0; i < days; i++) {
            // 计算行数
            var index = Math.floor((i + firstWeek) / 7);
            if (!list[index]) {
                list[index] = [];
            }

            list[index].push(i + 1);
        }

        //补全结尾空日期
        var lastRow = list[list.length - 1];
        var lastLen = lastRow.length;
        if (lastLen < 7) {
            for (var n = 0; n < (7 - lastLen); n++) {
                lastRow.push('');
            }
        }

        return list;
    }

    /**
     * 获取日期对象的详细信息
     * @param date
     */
    function fullDate(date) {
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            week: date.getDay(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        };
    }

    /**
     * 按天比较两个日期对象
     * @param date1
     * @param date2
     * @returns {boolean}
     */
    function compareDateByDay(date1, date2) {
        if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
            return false;
        }
        return date1.toLocaleDateString() == date2.toLocaleDateString();
    }

    /**
     * 将日期对象转化成指定分隔符分割的字符串
     * @param date
     * @param split
     * @returns {*}
     */
    function formatDate(date, split) {
        if (!(date instanceof Date)) {
            return 'arguments[0] must for the object!';
        }
        split = split || '/';
        var d = fullDate(date);
        return d.year + split + (d.month + 1) + split + d.day;
    }

    /**
     * 根据分隔符将字符串
     * @param str
     * @param split
     * @returns {Date}
     */
    function str2date(str, split) {
        if (typeof str != 'string' || !split) {
            return 'arguments is error!';
        }
        var dateArray = str.split(split);
        return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    }

    /**
     * 默认国际化配置
     * @type {{cn: {month: string[], week: string[], prevText: string, nextText: string}, en: {month: string[], week: string[], prevText: string, nextText: string}}}
     */
    var regional = {
        cn: {
            month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            week: ['日', '一', '二', '三', '四', '五', '六'],
            prevText: '<上月',
            nextText: '下月>'
        },
        en: {
            month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            prevText: 'Prev',
            nextText: 'Next'
        }
    };

    /**
     * 日历操作构造函数
     * @param element
     * @param option
     * @constructor
     */
    function ZCalendar(element, option) {

        this.element = element;
        this.option = $.extend({}, {
            defaultDate: null,
            regional: 'cn',
            monthChange: function () {
            },
            dateChange: function () {
            }
        }, typeof option == 'object' && option);

        this.init();

    }

    /**
     * 日历初始化
     */
    ZCalendar.prototype.init = function () {

        // 记录当前时间
        this.now = new Date();

        // 国际化
        this.regional = $.zcalendar.regional[this.option.regional || 'en'];
        // 月份切换标识
        this.monthMark = null;

        // 开始渲染日期组件
        this.drawCalendar();
    };

    /**
     * 渲染日期组件入口
     * @returns {ZCalendar}
     */
    ZCalendar.prototype.drawCalendar = function () {
        // 设置月份信息
        this.monthMark = this.monthMark || this.option.defaultDate || this.now;
        var _date = fullDate(this.monthMark);
        //_extend(this, _date);
        this.year = _date.year;
        this.month = _date.month;

        var wrapper = this.makeCalendar();
        this.element.html(wrapper);

        return this;
    };

    /**
     * 日历生成dom入口
     * @returns {*}
     */
    ZCalendar.prototype.makeCalendar = function () {

        var wrapper = $('<div class="zcalendar"></div>');
        var header = this.makeHeader();
        var body = this.makeBody();

        wrapper.append(header);
        wrapper.append(body);

        return wrapper;
    };

    /**
     * 日历顶部dom
     * @returns {*|HTMLElement}
     */
    ZCalendar.prototype.makeHeader = function () {
        var self = this;

        var header = $('<div class="zcalendar-header"></div>');
        var pre = $('<div class="zcalendar-handle zcalendar-pre">' + this.regional['prevText'] + '</div>');
        var next = $('<div class="zcalendar-handle zcalendar-next">' + this.regional['nextText'] + '</div>');
        var title = $('<div class="zcalendar-title">' + this.year + this.regional['month'][this.month] + '</div>');

        // 上个月
        pre.on('click', function () {
            self.changeMonth('prev');
        });
        // 下个月
        next.on('click', function () {
            self.changeMonth('next');
        });

        header.append(pre);
        header.append(title);
        header.append(next);

        return header;
    };

    /**
     * 日历body部分dom
     * @returns {*|HTMLElement}
     */
    ZCalendar.prototype.makeBody = function () {
        var body = $('<div class="zcalendar-body"></div>');
        var table = $('<table class="zcalendar-table"></table>');
        var week = this.makeWeek();
        var dates = this.makeDates();

        table.append(week);
        table.append(dates);

        body.append(table);

        return body;

    };

    /**
     * 星期dom
     * @returns {*|HTMLElement}
     */
    ZCalendar.prototype.makeWeek = function () {
        var thead = '<thead>';
        $.each(this.regional.week, function (i, w) {
            thead += '<td>' + w + '</td>';
        });
        thead += '</thead>';

        return $(thead);
    };

    /**
     * 每日dom
     * @returns {string}
     */
    ZCalendar.prototype.makeDates = function () {
        var self = this;
        var tbody = $('<tbody></tbody>');

        var daysList = getMonthList(this.year, this.month);
        $.each(daysList, function (i, list) {
            var tr = $('<tr class="zcalendar-date-list"></tr>');
            $.each(list, function (j, day) {
                var d = new Date(self.year, self.month, day || 0);
                var cla = '';
                cla += (day == "" ? "zcalendar-none" : "zcalendar-date");
                // 当天加重显示效果
                cla += (compareDateByDay(d, self.now) ? " zcalendar-date-now" : "");
                // 设置默认日期，添加选中效果
                cla += (compareDateByDay(d, self.option.defaultDate) ? " zcalendar-date-active" : "");

                var dayDom = $('<td class="' + cla + '">' + day + '</td>');
                dayDom.data('zcalendar-date', d);
                tr.append(dayDom);
            });

            tbody.append(tr);
        });

        tbody.on('click', '.zcalendar-date', function () {

            var curData = $(this).data('zcalendarDate');
            self.option.defaultDate = curData;

            self.element.find('.zcalendar-date-active').removeClass('zcalendar-date-active');
            $(this).addClass('zcalendar-date-active').siblings()

            if (typeof self.option.dateChange != "undefined") {
                self.option.dateChange(curData);
            }
        });

        return tbody;

    };


    ZCalendar.prototype.changeMonth = function (type) {

        this.monthMark = new Date(this.year, this.month + (type == 'prev' ? -1 : 1));
        this.drawCalendar();
        if (typeof this.option.monthChange != "undefined") {
            this.option.monthChange(this.year, this.month + 1);
        }
    };

    $.fn.zcalendar = function (option) {
        return this.each(function () {
            var self = $(this);

            var calendar = new ZCalendar(self, option);
            self.data('zcalendar', calendar);

            return self;
        });
    };

    // 添加工具函数
    $.zcalendar = {};
    $.zcalendar.formatDate = formatDate;
    $.zcalendar.str2date = str2date;
    $.zcalendar.regional = regional;

})(jQuery);