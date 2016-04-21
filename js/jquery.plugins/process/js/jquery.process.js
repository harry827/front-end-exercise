(function () {
    function Process(element, options) {
        this.element = $(element);
        this.options = $.extend({}, Process.defaults, options || {});

        this.init();
    }

    Process.defaults = {
        borderColor: '#cccccc',
        borderWidth: 5,
        barColor: 'blue',
        percent: 0
    };

    Process.prototype.constructor = Process;

    Process.prototype.init = function () {
        this.width = this.element.outerWidth();
        this.height = this.element.outerHeight();

        var outer = this.createBox();
        this.element.css('position', 'relative').append(outer);
        this.box = outer.children();

        this.createProcess();
    };

    Process.prototype.createBox = function () {
        var self = this;
        var outer = $('<div>').css({
            position: 'absolute',
            left: 0,
            top: 0,
            height: self.height,
            width: self.width,
            boxSizing: 'border-box'
        });
        var inner = $('<div>').css({
            position: 'relative',
            borderStyle: 'solid',
            borderWidth: self.options.borderWidth,
            borderColor: self.options.borderColor,
            borderStyle: 'solid',
            height: self.height,
            width: self.width,
            boxSizing: 'border-box'
        });

        outer.append(inner);
        return outer;
    };

    Process.prototype.createProcess = function () {
        if (typeof this.options.percent != 'number') {
            console.log('参数percent必须为数字!');
        }
        var percent = this.options.percent;
        var size = Math.floor(percent / 25);
        var directions = ['top', 'right', 'bottom', 'left'];
        for (var i = 0; i <= size; i++) {
            var per = (i != size) ? 1 : (percent % 25) / 25;
            this.createBar(directions[i], per);
        }

    }

    Process.prototype.createBar = function (direction, per) {
        var self = this;
        var bar = self.element.data('sProcess_' + direction);
        var borderWidth = self.options.borderWidth;
        var dirs = {
            top: {
                left: (0 - borderWidth),
                top: (0 - borderWidth),
                height: borderWidth,
                width: (self.width) * per
            },
            right: {
                left: self.width - borderWidth * 2,
                top: 0 - borderWidth,
                height: (self.height) * per,
                width: borderWidth
            },
            bottom: {
                right: 0 - borderWidth,
                top: self.height - borderWidth * 2,
                height: borderWidth,
                width: (self.width) * per
            },
            left: {
                left: 0 - borderWidth,
                bottom: 0 - borderWidth,
                height: (self.width) * per,
                width: borderWidth
            }
        };

        if (!bar) {
            bar = $('<div>');
            self.element.data('sProcess_' + direction, bar);
            bar.appendTo(self.box);
        }

        bar.css($.extend({
            position: 'absolute',
            backgroundColor: self.options.barColor,
            boxSizing: 'border-box'
        }, dirs[direction]));

    }

    Process.prototype.setPercent = function (options) {
        this.options = $.extend({}, this.options, options || {});
        this.createProcess();
    }

    $.fn.sProcess = function (options) {
        return this.each(function () {
            var process = $(this).data('sProcess');
            if (!process) {
                process = new Process(this, options);
                $(this).data('sProcess', process);
            } else {
                process.setPercent(options);
            }
        });
    }
})();
