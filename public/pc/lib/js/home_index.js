(function () {
    var slideMenu = function () {
        var sp, st, t, m, sa, l, w, gw, ot;
        return {
            destruct: function () {
                if (m) {
                    clearInterval(m.htimer);
                    clearInterval(m.timer);
                }
            },
            build: function (sm, sw, mt, s, sl, h) {
                sp = s;
                st = sw;
                t = mt;
                m = document.getElementById(sm);
                sa = m.getElementsByTagName('li');
                l = sa.length;
                w = m.offsetWidth;
                gw = w / l;
                ot = Math.floor((w - st) / (l - 1));
                var i = 0;
                for (i; i < l; i++) {
                    s = sa[i];
                    s.style.width = gw + 'px';
                    this.timer(s)
                }
                if (sl != null) {
                    m.timer = setInterval(function () {
                        slideMenu.slide(sa[sl - 1])
                    }, t)
                }
            },
            timer: function (s) {
                s.onmouseover = function () {
                    clearInterval(m.htimer);
                    clearInterval(m.timer);
                    m.timer = setInterval(function () {
                        slideMenu.slide(s)
                    }, t);
                    //console.log($(this).find('.mask_b').html());
                    $(this).find('.mask_b').hide();
                    //console.log($(this).find('.mask_b').attr("style"));
                }
                s.onmouseout = function () {
                    clearInterval(m.timer);
                    clearInterval(m.htimer);
                    m.htimer = setInterval(function () {
                        slideMenu.slide(s, true)
                    }, t);
                    //console.log($(this).find('.mask_b').html());
                    $(this).find('.mask_b').show();
                    //console.log($(this).find('.mask_b').attr("style"));
                }
            },
            slide: function (s, c) {
                var cw = parseInt(s.style.width);
                if ((cw < st && !c) || (cw > gw && c)) {
                    var owt = 0;
                    var i = 0;
                    for (i; i < l; i++) {
                        if (sa[i] != s) {
                            var o, ow;
                            var oi = 0;
                            o = sa[i];
                            ow = parseInt(o.style.width);
                            if (ow < gw && c) {
                                oi = Math.floor((gw - ow) / sp);
                                oi = (oi > 0) ? oi : 1;
                                o.style.width = (ow + oi) + 'px';
                                //console.log(o);
                                //console.log(o.style.width);
                            } else if (ow > ot && !c) {
                                oi = Math.floor((ow - ot) / sp);
                                oi = (oi > 0) ? oi : 1;
                                o.style.width = (ow - oi) + 'px';
                                //console.log(o);
                                //console.log(o.style.width);
                            }
                            if (c) {
                                owt = owt + (ow + oi)
                            } else {
                                owt = owt + (ow - oi)
                            }
                        }
                    }
                    s.style.width = (w - owt) + 'px';
                } else {
                    if (m.htimer)
                        clearInterval(m.htimer)
                    if (m.timer)
                        clearInterval(m.timer);
                }
            }
        };
    }();
    slideMenu.build('sm', 400, 10, 10, 1);
})();

$(function () {
    $('#news-list').setSlide({
        slideLiw:400,
        slideLih:400
    })
})