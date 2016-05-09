/*!
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2015 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.7
 *
 */

(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,  // 可增大可见区域的范围
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : false,
            appear          : null,
            load            : null,
            placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        /**
         * 更新
         */
        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                // 如果图片隐藏，且忽略隐藏，则中断循环
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }

                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) { // img满足在container视口中，则显示
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        // 如果存在那么重新设置计数
                        counter = 0;
                } else {
                    //如果找到的是第failure_limit个img元素，
                    // 且不在container视口上方，左方及视口内（可以允许在视口下方，右方），则中断循环
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        // merge默认配置和插件使用人（开发者）配置信息
        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        // 设置被懒加载图片所在的容器，默认为window
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */

        // 绑定滚动事件
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            // 设置图片默认未加载状态
            self.loaded = false;

            /* If no src attribute given use data:uri. */
            // <img class="lazy" data-original="img/1.jpg" width="640" height="480">
            // 如果图片src未设置，那么设置图片的默认src路径
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            // 绑定一个自定义事件“appear”（只执行一次）,处理img显示真实的图片地址
            $self.one("appear", function() {
                if (!this.loaded) {
                    // 开始展现图片的时候，触发插件使用人（开发者）自定义的appear事件
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    // 生成一个假的img标签元素先将图片加载到本地，然后才将图片显示到页面对应图片dom元素中
                    $("<img />")
                        .bind("load", function() { // load 图片加载完成

                            // 获取原地址
                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            // 判断当前标签是否为img，设置对应的src/background-image
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            // 设置图片展示效果
                            $self[settings.effect](settings.effect_speed);
                            // 设置图片完成加载状态
                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            // 在图片元素数组中过滤掉已经加载完毕图片元素
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            // 图片加载完毕，触发插件使用人（开发者）自定义的load事件
                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            // 当event不为滚动事件（scroll）的时候，将事件绑定到当前的图片元素上
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        // 绑定窗口resize事件
        $window.bind("resize", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        // onpageshow 事件在用户浏览网页时触发。
        // onpageshow 事件类似于 onload 事件，onload 事件在页面第一次加载时触发，
        // onpageshow 事件在每次加载页面时触发，即 onload 事件在页面从浏览器缓存中读取时不触发。
        // 为了查看页面是直接从服务器上载入还是从缓存中读取，你可以使用 PageTransitionEvent 对象的 persisted 属性来判断。
        // 如果页面从浏览器的缓存中读取该属性返回 ture，否则返回 false。
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */
    // 当前元素不可见，在视口下方
    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    // 当前图片元素的左侧边沿大于等于container的右侧边沿，也就是说：当期元素不可见，在视口右方
    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    // 当前图片元素的底部边沿小于等于container的顶部边沿，也就是说：当期元素不可见，在视口上方
    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    // 当前图片元素的右侧侧边沿小于等于container的左侧边缘，也就是说：当期元素不可见，在视口左方
    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    // 获取可见区域的元素
    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    /**
     * $.expr[":"] --> 自定义jquery伪类选择器：
     *
     * $.expr[":"]["isA"] = function(elem){
     *      if(elem.nodeName.toLocaleLowerCase() == 'a'){
     *          return $(elem);
     *      }
     * }
     */
    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);
