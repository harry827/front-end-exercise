$(function () {

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function arr_upset(arr) {
        arr.sort(function () {
            return Math.random() > 0.5 ? 1 : -1;
        });

        return arr;
    }

    var total = 750,
        num = 15,
        min = 10;
    var arr = [];
    for (var i = 1; i < num; i++) {
        var safe_total = (total - (num - i) * min) / (num - i); //随机金额安全上限
        var money = Math.floor(random(min, safe_total));
        total = total - money;
        arr.push(money);
    }
    arr.push(total);
    arr = arr_upset(arr);

    var list = $('#red-list');
    var i = 0;
    for (; i < num; i++) {
        var li = '<li class="bounceInDown"><div class="red-block"><div class="red-money">' + arr[i] +
            '</div><img src="red.png" alt=""></div></li>';
        list.append(li);
    }


    var bg = $('.red-bg'),
        modal = $('.red-modal');

    list.find('li').on('click', function () {
        var self = $(this);

        modal.html(self.find('.red-block').clone()).show();
        modal.find('img').addClass('animated-open');
        bg.show();
        setTimeout(function () {
            modal.find('.red-money').show();
            self.find('.red-money').show();
            self.find('img').hide();
        }, 1200);

        setTimeout(function () {
            modal.fadeOut('fast');
            bg.fadeOut('fast');
        }, 2000);

        self.off('click');

    });


});
