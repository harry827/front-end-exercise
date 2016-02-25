(function ($) {

    function randomId() {
        var id = 0;
        return (function () {
            return "ant_fileUpload_" + id++;
        })();
    };

    var defaults = {
        action: "/upload",
        change: function (filename) {
        },
        submit: function (filename) {
        },
        complete: function (filename, response) {
        }
    };

    function FileUpload(element, option) {
        var self = this;
        this.element = element;
        this.option = $.extend({}, defaults, typeof option == 'object' && option);

        element.on('click', function (e) {
            var iframe = self.createIframe(),
                form = self.createForm(iframe),
                file = form.find('input');

            $('body').append(iframe);
            $('body').append(form);

            file.on('change', function () {
                var filename = $(this).val();
                self.option.change(filename);

                form.on('submit', function () {
                    self.option.submit(filename);
                });

                iframe.on('load', function () {
                    var doc = (this.contentWindow || this.contentDocument).document,
                        response = doc.body.innerText;

                    self.option.complete(filename, response);

                    iframe.remove();
                    form.remove();

                });

                form.submit();
            });

            file.trigger('click');

        });

    }

    FileUpload.prototype.createIframe = function () {
        var id = randomId();
        var iframe = $('<iframe src="javascript:void(0);" name="' + id + '" id="' + id + '" style="display: none;"></iframe>');

        return iframe;
    };

    FileUpload.prototype.createForm = function (iframe) {
        var form = $('<form/>')
            .attr({
                method: 'post',
                action: this.option.action,
                enctype: 'multipart/form-data',
                target: iframe[0].name
            })
            .css('display', 'none');

        var file = $('<input type="file" name="file"/>');

        form.append(file);

        return form;
    };

    $.fn.fileUpload = function (option) {
        return this.each(function () {
            var self = $(this);
            new FileUpload(self, option);
            return self;
        });
    };

})(jQuery);