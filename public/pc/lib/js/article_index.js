$(function () {
    let table = layui.table;
    let language = [1, 1];
    let allCols = [ //标题栏
        {
            field: 'id',
            title: 'ID',
            width:80
        }, {
            field: 'cover',
            title: '封面图片',
            width:130,
            templet: function (d) {
                return `<img src="${d.cover}">`
            }
        }, {
            field: 'title',
            title: '中文标题'
        }, {
            field: 'entitle',
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
    let options = {
        url: '/manage/getArticleList',
        elem: '#demo',
        id: 'demo',
        page: {
            curr: 1 //重新从第 1 页开始
        },
        limit: 10,
        limits: [10, 15, 20],
        height: 'full-200',
        where: {},
        cols: [
            [...allCols]
        ]
    }
    let zhCols = [ //标题栏
        {
            field: 'id',
            title: 'ID',
            width:80
        }, {
            field: 'cover',
            title: '封面图片',
            width:130,
            templet: function (d) {
                return `<img src="${d.cover}">`
            }
        }, {
            field: 'title',
            title: '中文标题'
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
    let enCols = [ //标题栏
        {
            field: 'id',
            title: 'ID',
            width:80
        }, {
            field: 'cover',
            title: '封面图片',
            width:130,
            templet: function (d) {
                return `<img src="${d.cover}">`
            }
        }, {
            field: 'entitle',
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

    let ArticleList = table.render(options);

    $('#btn-search').on('click', function (e) {
        let keyword = $('#ipt-keyword').val();
        options.where.keyword = keyword
        ArticleList.reload(options);
    })

    $('#btn-clear').on('click', function (e) {
        delete options.where.keyword
        delete options.where.language
        language = [1, 1]
        $(".layui-form-checkbox").addClass('layui-form-checked');
        $('[type="checkbox"]').prop('checked', true);
        options.cols[0] = allCols;
        ArticleList.reload(options);
    })

    $('#ipt-keyword').on('keypress', function (e) {
        if (e.keyCode === 13) {
            $('#btn-search').click();
        }
    })

    layui.use('form', function () {
        let form = layui.form;
        form.on('checkbox(lang)', function (data) {
            let lang = $(data.elem).attr('name');
            if (data.elem.checked) {
                if (lang === 'zh') {
                    language[0] = 1
                } else {
                    language[1] = 1
                }
            } else {
                if (lang === 'zh') {
                    language[0] = 0
                } else {
                    language[1] = 0
                }
            }
            options.where.language = language.join('');
            switch (options.where.language) {
                case '10':
                    options.cols[0] = zhCols
                    break;
                case '01':
                    options.cols[0] = enCols
                    break;
                default:
                    options.cols[0] = allCols
                    break;
            }
            ArticleList.reload(options);
        });
    });
    //工具条操作
    table.on('tool(demo)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        let data = obj.data; //获得当前行数据
        let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        let tr = obj.tr; //获得当前行 tr 的DOM对象
        // console.log(obj);
        if (layEvent === 'detail') { //查看
            //do somehing
            window.open(`/news/${data.id}`)
        } else if (layEvent === 'del') { //删除
            layer.confirm('真的要删除这篇文章吗？', function (index) {
                // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                layer.close(index);
                $.ajax({
                    type: "POST",
                    url: "/manage/deletearticle",
                    dataType: "json",
                    data: {
                        id: data.id
                    },
                    success: function (data) {
                        if (data.ok === 200) {
                            obj.del();
                        } else {
                            alert(data.msg)
                        }
                    }
                });
            });
        } else if (layEvent === 'edit') { //编辑
            //do something
            window.location.href = `/manage/editarticle/${data.id}`
            //同步更新缓存对应的值
            // obj.update({
            //     username: '123',
            //     title: 'xxx'
            // });
        }
    });
})