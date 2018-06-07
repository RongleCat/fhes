$(function () {
    let $nav = $('.left-nav');
    let $content = $('.content-block');
    let top;
    let _block = [];
    let bodyHeight = $(document).height();
    let windowHeight = $(window).height();
    let stopHeight = bodyHeight-windowHeight-720;
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
            $nav.css({'top':'0'})
        } else if(scrollY>=stopHeight){
            $nav.css({'top':(stopHeight)+'px'})
        }
        else {
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
        var point = new BMap.Point(121.660293,29.889404);
        map.centerAndZoom(point, 17);
        var marker = new BMap.Marker(point); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    }
})

function setNavTop(el) {
    let windowTop = $(window).scrollTop();
    let mainTop = $('.other-main').offset().top;
    el.css({'top':(windowTop - mainTop + 100) + 'px'})

}

function limit(arr, num) {
    var newArr = [];
    arr.map(function (x) {
        newArr.push(Math.abs(x - num));
    });
    var index = newArr.indexOf(Math.min.apply(null, newArr));
    return index;
}