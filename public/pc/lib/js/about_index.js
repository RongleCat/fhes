$(function () {
    let $nav = $('.left-nav');
    let $content = $('.content-block');
    let top;
    let _block = [];
    let bodyHeight = $(document).height();
    let windowHeight = $(window).height();
    let stopHeight = bodyHeight - windowHeight - 720;
    $content.map((index, item) => {
        _block.push($(item).offset().top)
    })
    $(window).on('hashchange', e => {
        let hash = window.location.hash;
        $(`${hash}_hash`).addClass('active').siblings().removeClass('active')
        // setNavTop($nav)
    })
    setTimeout(() => {
        if (window.location.hash) {
            top = $(window.location.hash).offset().top
            $(window).scrollTop(top)
            $(`${window.location.hash}_hash`).addClass('active').siblings().removeClass('active')
            setNavTop($nav);
        }
    }, 10);
    $(window).on('scroll', e => {
        let scrollY = $(window).scrollTop();
        $nav.find('li').eq(limit(_block, scrollY + 300)).addClass('active').siblings().removeClass('active')
        if (scrollY <= 400) {
            $nav.css({
                'top': '0'
            })
        } else if (scrollY >= stopHeight) {
            $nav.css({
                'top': (stopHeight) + 'px'
            })
        } else {
            setNavTop($nav);
        }
    })

    let $powerNav = $('.img-view-nav');
    let $powerContent = $('.img-view-content');
    $powerNav.on('click', '.item', function (e) {
        let _index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        if (_index === 2) {
            $powerNav.find('.item-01').addClass('bottom')
        } else {
            $powerNav.find('.item-01').removeClass('bottom')
        }
        $powerContent.find('.item').removeClass('active').eq(_index).addClass('active');
    })
    window.onload = e => {
        var map = new BMap.Map("map");
        var point = new BMap.Point(121.660293, 29.889404);
        map.centerAndZoom(point, 17);
        var marker = new BMap.Marker(point); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    }

    // var swiper_one = new Swiper('#swiper_one', {
    //     loop: true,
    //     pagination: '.swiper-pagination.swiper_one',
    //     grabCursor: true,
    //     paginationClickable: true,
    //     onSlideChangeEnd(swiper) {
    //         let $slide = $(swiper.wrapper).find('.swiper-slide-active');
    //         let $img = $slide.find('img');
    //         let _src = $img.attr('layer-src');
    //         if (!$img[0].src) {
    //             $img[0].src = _src;
    //         }
    //     }
    // });
    // var swiper_two = new Swiper('#swiper_two', {
    //     loop: true,
    //     pagination: '.swiper-pagination.swiper_two',
    //     grabCursor: true,
    //     paginationClickable: true,
    //     onSlideChangeEnd(swiper) {
    //         let $slide = $(swiper.wrapper).find('.swiper-slide-active');
    //         let $img = $slide.find('img');
    //         let _src = $img.attr('layer-src');
    //         if (!$img[0].src) {
    //             $img[0].src = _src;
    //         }
    //     }
    // });
    // var swiper_three = new Swiper('#swiper_three', {
    //     loop: true,
    //     pagination: '.swiper-pagination.swiper_three',
    //     grabCursor: true,
    //     paginationClickable: true,
    //     onSlideChangeEnd(swiper) {
    //         let $slide = $(swiper.wrapper).find('.swiper-slide-active');
    //         let $img = $slide.find('img');
    //         let _src = $img.attr('layer-src');
    //         if (!$img[0].src) {
    //             $img[0].src = _src;
    //         }
    //     }
    // });

    // $('.swiper-button-prev').on('click', function (e) {
    //     e.preventDefault()
    //     if ($(this).hasClass('swiper_one')) {
    //         swiper_one.swipePrev()
    //     } else if ($(this).hasClass('swiper_two')) {
    //         swiper_two.swipePrev()
    //     } else {
    //         swiper_three.swipePrev()
    //     }

    // })

    // $('.swiper-button-next').on('click', function (e) {
    //     e.preventDefault()
    //     if ($(this).hasClass('swiper_one')) {
    //         swiper_one.swipeNext()
    //     } else
    //     if ($(this).hasClass('swiper_two')) {
    //         swiper_two.swipeNext()
    //     } else {
    //         swiper_three.swipeNext()
    //     }
    // })
    // var swiper_two = new Swiper('#swiper_two', {
    //     loop: true,
    //     preventClicks: false,
    //     nextButton: '.swiper-button-next.swiper_two',
    //     prevButton: '.swiper-button-prev.swiper_two',
    //     pagination: '.swiper-pagination.swiper_two',
    //     preloadImages: false,
    //     lazyLoading: true
    // });
    // var swiper_three = new Swiper('#swiper_three', {
    //     loop: true,
    //     preventClicks: false,
    //     nextButton: '.swiper-button-next.swiper_three',
    //     prevButton: '.swiper-button-prev.swiper_three',
    //     pagination: '.swiper-pagination.swiper_three',
    //     preloadImages: false,
    //     lazyLoading: true
    // });

    layer.photos({
        photos: '.power-left',
        anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
    });
})

function setNavTop(el) {
    let windowTop = $(window).scrollTop();
    let mainTop = $('.other-main').offset().top;
    el.css({
        'top': (windowTop - mainTop + 100) + 'px'
    })

}

function limit(arr, num) {
    var newArr = [];
    arr.map(function (x) {
        newArr.push(Math.abs(x - num));
    });
    var index = newArr.indexOf(Math.min.apply(null, newArr));
    return index;
}