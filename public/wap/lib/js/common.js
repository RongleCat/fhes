window.onload = () => {
    $('[data-hd]').each((i, item) => {
        let hdSrc = $(item).attr('data-hd');
        let hdimg = new Image();
        $(hdimg).on('load', function (e) {
            if (item.localName === 'img') {
                item.src = e.target.src
            } else {
                let src = e.target.src || e.currentTarget.href
                $(item).css('background-image', `url('${src}')`)
            }
        })
        hdimg.src = hdSrc;
    });
}

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
            if (isWeiXin()) {
                window.location.href = window.location.href.split('?')[0] + '?t='+ Date.parse(new Date())
            } else {
                window.location.reload();
            }
        }, 100);
    });
    let $menu = $('.menu-list');
    let $menuMask = $('.menu-mask-layer');
    $('.btn-menu').on('click', function () {
        if ($menu.hasClass('open')) {
            $menu.removeClass('open')
            $menuMask.removeClass('open')
        } else {
            $menu.addClass('open')
            $menuMask.addClass('open')
        }
    })
    $menuMask.on('click', function () {
        $(this).removeClass('open');
        $menu.removeClass('open');
    })
})


function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}