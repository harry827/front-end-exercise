(function ($) {

    var opt = {
        columns: 5,
        target: '.cbox'
    };

    var main = $('.main');
    main.css({
        'position': 'relative',
        'display': 'block'
    });
    //内容块的宽度
    var box_width = main.outerWidth() / opt.columns;
    //内容块的最大索引值
    var num = -1;

    function cascades() {
        var boxs = main.find(opt.target);
        //定义一个数组存储每列的高度
        var columnHeight = [];
        //最小高度所在的列
        var column = 0;
        //获取每列的最小高度
        var minHeight = 0;
        $.each(boxs, function (index, box) {
            if (index < opt.columns) { //当展示块索引小于列数时
                column = index;
            } else {
                minHeight = Math.min.apply({}, columnHeight);
                for (var i = 0, l = columnHeight.length; i < l; i++) {
                    if (columnHeight[i] == minHeight) {
                        column = i;
                    }
                }
            }
            setStyle(index, box, column, minHeight);
            //给相应的列增加内容块高度
            columnHeight[column] = (columnHeight[column] || 0) + $(box).outerHeight();

        });
    }
    //设置加载内容块样式
    function setStyle(index, box, column, minHeight) {
        //当前内容块索引值小于等于上次最大索引值不执行任何操作
        if (num >= index) {
            return;
        }
        $(box).css({
            position: "absolute",
            left: column * box_width + "px",
            top: minHeight + "px",
            width: box_width + 'px',
            'opacity': "0",
            'overflow': 'hidden'
        }).animate({
            "opacity": "1"
        }, 900);

        num = index; //更新请求数据的条数位置
    }

    function swit() {
        var lastbox = main.find(opt.target).eq(num);
        var lastboxHeight = lastbox.offset().top + Math.floor(lastbox.outerHeight() / 2);
        var windowHeight = $(window).height();
        var scrollTop = $(window).scrollTop(); //滚动条距离顶部的距离
        return lastboxHeight < windowHeight + scrollTop ? true : false;
    }
    
    var ajaxkey = true;
    $(window).scroll(function () {
        if (swit() && ajaxkey) {
            getData();
        }
    });

    //加载数据的方法
    function getData() {
        ajaxkey = false;
        $.ajax({
            type: "get",
            url: "data.json",
            dataType: "json",
            success: function (data) {
                $(data).each(function (i, dt) {
                    var box = $("<div class='cbox'><div class='pic'><img src=" + dt.src + "></div></div>");
                    main.append(box);
                });
                ajaxkey = true;
                cascades();
            }
        });
    }

    cascades();

})(jQuery);