$(function () {
    let table = layui.table;
    let language = [0,0];
    let options = {
        url: '/manage/getArticleList',
        elem: '#demo',
        id: 'demo',
        page: {
            curr: 1 //重新从第 1 页开始
        },
        limit: 1,
        limits: [1, 2, 3],
        height: 'full-200',
        where: {},
        cols: [
            [ //标题栏
                {
                    field: 'id',
                    title: 'ID'
                }, {
                    field: 'title',
                    title: '中文标题'
                }, {
                    field: 'entitle',
                    // sort: true,
                    title: '英文标题'
                }, {
                    field: 'edittime',
                    templet: function (d) {
                        return `${tools.dateFormat(new Date(d.edittime))}`
                    },
                    title: '编辑时间'
                }, {
                    fixed: 'right',
                    align: 'center',
                    toolbar: '#barDemo',
                    title: '操作'
                }
            ]
        ]
    }
    let ArticleList = table.render(options);

    $('#btn-search').on('click', function (e) {
        let keyword = $('#ipt-keyword').val();
        options.where.keyword = keyword
        ArticleList.reload(options);
    })

    $('#btn-clear').on('click', function (e) {
        delete options.where.keyword
        delete options.where.language
        language = [0,0]
        $(".layui-form-checkbox").removeClass('layui-form-checked');
        $('[type="checkbox"]').prop('checked',false);
        ArticleList.reload(options);
    })

    $('#ipt-keyword').on('keypress',function (e){
        if(e.keyCode === 13){
            $('#btn-search').click();
        }
    })

    $(".layui-form-checkbox").on("click",function(){
        let $this = $(this).prev();
        let lang = $this.attr('name');
        if ($this[0].checked) {
            if (lang === 'zh') {
                language[0] = 1
            }else{
                language[1] = 1
            }
        }else{
            if (lang === 'zh') {
                language[0] = 0
            }else{
                language[1] = 0
            }
        }
        options.where.language = language.join('');
        ArticleList.reload(options);
    })
    //工具条操作
    table.on('tool(demo)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        let data = obj.data; //获得当前行数据
        let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        let tr = obj.tr; //获得当前行 tr 的DOM对象
        console.log(obj);
        if (layEvent === 'detail') { //查看
            //do somehing
        } else if (layEvent === 'del') { //删除
            layer.confirm('真的删除行么', function (index) {
                obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                layer.close(index);
                //向服务端发送删除指令
            });
        } else if (layEvent === 'edit') { //编辑
            //do something

            //同步更新缓存对应的值
            obj.update({
                username: '123',
                title: 'xxx'
            });
        }
    });
})