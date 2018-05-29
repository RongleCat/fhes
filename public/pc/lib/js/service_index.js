$(function () {
    let $nav = $('.left-nav');
    let $content = $('.content-block');
    let top;
    let _block = [];

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
            $nav.css('top', '0px')
        } else {
            setNavTop($nav);
        }
    })
})

function setNavTop(el) {
    let windowTop = $(window).scrollTop();
    let mainTop = $('.other-main').offset().top;
    el.css('top', (windowTop - mainTop + 100) + 'px')
}

function limit(arr, num) {
    var newArr = [];
    arr.map(function (x) {
        newArr.push(Math.abs(x - num));
    });
    var index = newArr.indexOf(Math.min.apply(null, newArr));
    return index;
}