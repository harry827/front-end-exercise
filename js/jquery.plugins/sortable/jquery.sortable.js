(function ($) {

    $.fn.sortable = function (options) {

        var opt = options || {};

        return this.each(function () {

            var items = $(this).children().attr('draggable', true);

            var placeholder = $('<' + items[0].nodeName + ' class="sortable-placeholder">');

            var isHandle, dragging;

            items.mousedown(function () {
                isHandle = true;
            }).mouseup(function () {
                isHandle = false;
            });

            items.bind('dragstart', function (e) {  //绑定在拖拽对象上，当开始拖拽时触发
                if (!isHandle) {
                    return false;
                }
                isHandle = false;
                //设置被拖拽对象允许的操作
                e.originalEvent.dataTransfer.effectAllowed = 'move';
                e.originalEvent.dataTransfer.setData('Text', this.innerHTML);

                dragging = $(this).addClass('sortable-dragging');

                index = dragging.index();
            /**
                dragenter  绑定在可以drop的对象上，当拖拽进到此处时触发，只在进入这个对象时触发一次。
                dragover	绑定在可以drop的对象上，当拖拽在此处时触发，不管鼠标是否移动都会多次触发。
                drop	绑定在可以drop的对象上，在允许drop的时候触发
            */
            }).bind('dragover dragenter drop', function (e) {

                //设置drop可以接受的行为，能不能drop由这里的设置决定，drop事件中不处理dropEffect
                e.originalEvent.dataTransfer.dropEffect = 'move';
                // 必须阻止默认事件，否则无法触发drop事件
                e.preventDefault();

                //如果拖拽目标是items其中之一
                if ($(this).is(items)) {
                    dragging.hide();
                    $(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
                }
                return false;
            }).bind('dragend', function (e) {  //绑定在拖拽对象上，在拖拽结束时触发
                
                placeholder.after(dragging).remove();
                dragging.removeClass('sortable-dragging').fadeIn();
                dragging = null;

            }).not('a[href], img').on('selectstart.h5s', function () {
                // 当元素选中时，阻止元素背景色边蓝
                this.dragDrop && this.dragDrop();
                return false;
            });

        });


    }

})(jQuery);