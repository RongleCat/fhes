$(function () {
    var lang = $.cookie('lang') || 'zh';
    $('.select-lang').on('click', function () {
        if (lang === 'zh') {
            $.cookie('lang', 'en', {
                path: '/'
            });
        } else {
            $.cookie('lang', 'zh', {
                path: '/'
            });
        }
        setTimeout(function () {
            window.location.reload();
        }, 100);
    });
    window.onload = function () {
        $('[data-hd]').each((i, item) => {
            let hdSrc = $(item).data('hd');
            let hdimg = new Image();
            $(hdimg).on('load', function (e) {
                if (item.localName === 'img') {
                    item.src = e.target.src
                } else {
                    $(item).css('background-image', `url('${e.target.src}')`)
                }
            })
            hdimg.src = hdSrc;
        });
    }
});