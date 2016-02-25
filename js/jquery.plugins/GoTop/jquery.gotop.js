(function($, window, document){
    
    $.scrollUp = function(options){
        
        var opt = $.extend({}, $.scrollUp.defaults, options||{});
        
        var $self = null,
            triggerVisible = true;
        
        if(!opt.scrollId){
            $self = $('<a href="#top" id="scrollTop">'+opt.scrollText+'</a>')
                    .html(opt.scrollText)
                    .appendTo('body');
        }else{
            $self = $('#'+opt.scrollId);
        }
        
        $self.css({
            display: 'none',
            position: 'fixed',
            zIndex: opt.zIndex
        });
        
        $(window).scroll(function(){
            if($(window).scrollTop() > opt.scrollHeight){
                if(triggerVisible) {
                    $self.fadeIn('fast');
                    triggerVisible = false;
                }
            }else{
                if(!triggerVisible) {
                    $self.fadeOut('fast');
                    triggerVisible = true;
                }
            }
        });
        
        $self.on('click',function(e){
            e.preventDefault();
            $("html,body").animate({'scrollTop':0},opt.scrollSpeed);
            
        });
        
    }
    
    $.scrollUp.defaults = {
        /*scrollId: 'scrollTop',*/
        scrollId: false,
        scrollHeight: 100,
        scrollSpeed: 300,
        scrollText: 'Top',
        zIndex: 9999
    }
    
    $.fn.scrollUp = function(options){
        options = options || {};
        options.scrollId = $(this)[0].id;
        $.scrollUp(options);
    }
    
})(jQuery, window, document);