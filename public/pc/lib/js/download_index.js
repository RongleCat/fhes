$(function () {
    let _count = $('#page').data('count');
    let $list = $('#list');
    layui.use('laypage', function () {
        var laypage = layui.laypage;
        laypage.render({
            elem: 'page',
            count: parseInt(_count),
            limit: 10,
            jump: function (obj, first) {
                $list.empty();
                loading(true)
                $.ajax({
                    type: "Get",
                    url: "/getDownFileList",
                    dataType: "json",
                    data: {
                        limit: obj.limit,
                        page: obj.curr
                    },
                    success: function (r) {
                        if (r.ok === 200) {
                            let html = '';
                            r.data.map((item, index) => {
                                html += `<div class="item clearfix">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-${item.type}"></use>
                                    </svg>
                                    <p>${r.lang==='zh'?item.title:item.entitle}</p>
                                    <div class="right-box">
                                        <span>${item.type==='othe'?'other':item.type}</span>
                                        <span>${item.size}</span>
                                        <a href="${item.filepath}?attname=" download>${r.lang==='zh'?'下载':'Download'}</a>
                                    </div>
                                </div>`
                            })
                            $list.append(html)
                            loading()
                        } else {
                            alert(r.msg)
                        }
                    }
                });
            }
        });
    });
})

function loading(state){
    let $loading = $('.loading-layer')
    if (state) {
        $loading.removeClass('close')
    }else{
        $loading.addClass('close')
    }
}