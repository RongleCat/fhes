$(function () {
    let _count = $('#page').data('count');
    let $list = $('.down-list');
    layui.use('laypage', function () {
        var laypage = layui.laypage;
        laypage.render({
            elem: 'page',
            count: parseInt(_count),
            limit: 10,
            jump: function (obj, first) {
                $.ajax({
                    type: "Get",
                    url: "/getDownFileList",
                    dataType: "json",
                    data: {
                        limit:obj.limit,
                        page:obj.curr
                    },
                    success: function (r) {
                        if (r.ok === 200) {
                            console.log(r);
                            let html = '';
                            r.data.map((item,index)=>{
                                html+=`<div class="item clearfix">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icon-${item.type}"></use>
                                    </svg>
                                    <p>${item.lang==='zh'?item.title:item.entitle}</p>
                                    <div class="right-box">
                                        <span>${item.size}</span>
                                        <a href="${item.filepath}?attname=" download>{{lang.download}}</a>
                                    </div>
                                </div>`
                            })
                            $list.empty().append(html)
                        } else {
                            alert(r.msg)
                        }
                    }
                });
            }
        });
    });
})