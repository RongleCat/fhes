$(function () {
    let $all = $('.content-container p');
    let html = '';
    $all.map((index, item) => {
        let $p = $(document.createElement('p'))
        console.log($(item).find('>*'));
        if ($(item).css('text-align') == 'center') {
            $p.addClass('s-center')
        }
        if ($(item).find('img').length) {
            $p.append(`<img src="${$(item).find('img')[0].src}">`).addClass('s-img')
        } else {
            $(item).find('style').remove();

            let pt = $(item).text().replace(/ /ig, '')
            $p.text(pt)
        }
        if ($(item).find('img').length || $p.text().length != 0) {
            html += $p[0].outerHTML;
        }
    })
    $('.content-container').empty().append(html)
    $('.loading-layer').fadeOut('fast')
})