const fileTypes = ['othe', 'zip', 'avi', 'swf', 'wav', 'txt', 'rmvb', 'xls', 'mkv', 'psd', 'exe', 'gif', 'pdf', 'mp4', 'ppt', 'png', 'mp3', 'jpg', 'doc']
let layer = null
$(function () {
    let table = layui.table;
    let options = {
        url: '/manage/getClassList',
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
            [{
                field: 'id',
                title: 'ID',
                width: 80
            }, {
                field: 'classname',
                title: '中文名称'
            }, {
                field: 'eclassname',
                title: '英文名称'
            }, {
                fixed: 'right',
                align: 'center',
                title: '操作',
                width: 180,
                field: '',
                templet(d) {
                    return `<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="edit">编辑</a>
                    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>`
                }
            }]
        ]
    }
    let DownloadList = table.render(options);

    table.on('tool(demo)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        let $data = obj.data; //获得当前行数据
        let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        let tr = obj.tr; //获得当前行 tr 的DOM对象
        if (layEvent === 'del') { //删除
            layer.confirm('真的要删除这个分类吗？', function (index) {
                // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                layer.close(index);
                $.ajax({
                    type: "POST",
                    url: "/manage/deleteclass",
                    dataType: "json",
                    data: {
                        id: $data.id,
                    },
                    success: function (r) {
                        if (r.ok === 200) {
                            obj.del();
                        } else {
                            layer.msg(r.msg, () => {})
                        }
                    }
                });
            });
        } else {
            layer.open({
                type: 1,
                area: '400px',
                title: '修改分类名称',
                content: `<div class="addfile-container">
                <form class="layui-form layui-form-pane">
                <div class="layui-form-item">
                    <label class="layui-form-label">分类名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="title" lay-verify="" placeholder="请输入分类名称" autocomplete="off" class="layui-input" value="${$data.classname}">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">英文名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="etitle" lay-verify="" placeholder="请输入分类英文名称" autocomplete="off" class="layui-input" value="${$data.eclassname}">
                    </div>
                </div>
                    
                    <div class="layui-form-item btn-box">
                        <button class="layui-btn" lay-submit lay-filter="submit" id="btn-submit">立即提交</button>
                    </div>
                </form>
            </div>`,
                success(el, index) {
                    console.log(el, index);
                    layui.use('form', function () {
                        let form = layui.form;
                        form.on('submit(submit)', function (data) {
                            console.log(data);
                            if (!$.trim(data.field.title)) {
                                layer.msg('分类名称不能为空', () => {})
                                return false;
                            }
                            if (!$.trim(data.field.etitle)) {
                                layer.msg('分类英文名称不能为空', () => {})
                                return false;
                            }

                            let post = {
                                id: $data.id,
                                classname: $.trim(data.field.title),
                                eclassname: $.trim(data.field.etitle)
                            }

                            console.log(post);

                            $.ajax({
                                type: "POST",
                                url: "/manage/changeclass",
                                dataType: "json",
                                data: post,
                                success: function (data) {
                                    if (data.ok === 200) {
                                        // targetParent('DownloadList')
                                        location.reload();
                                    } else {
                                        layer.msg(data.msg)
                                    }
                                }
                            });
                            return false;
                        })
                    })
                }
            });
        }
    });

    layui.use('layer', function () {
        layer = layui.layer;
        $('#btn-addfile').on('click', function () {
            let index = layer.open({
                type: 1,
                area: '400px',
                content: `<div class="addfile-container">
                <form class="layui-form layui-form-pane">
                <div class="layui-form-item">
                    <label class="layui-form-label">分类名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="title" lay-verify="" placeholder="请输入分类名称" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">英文名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="etitle" lay-verify="" placeholder="请输入分类英文名称" autocomplete="off" class="layui-input">
                    </div>
                </div>
                    
                    <div class="layui-form-item btn-box">
                        <button class="layui-btn" lay-submit lay-filter="submit" id="btn-submit">立即提交</button>
                    </div>
                </form>
            </div>`,
                success(el, index) {
                    layui.use('form', function () {
                        let form = layui.form;
                        form.on('submit(submit)', function (data) {
                            console.log(data);
                            if (!$.trim(data.field.title)) {
                                layer.msg('分类名称不能为空', () => {})
                                return false;
                            }
                            if (!$.trim(data.field.etitle)) {
                                layer.msg('分类英文名称不能为空', () => {})
                                return false;
                            }

                            let post = {
                                classname: $.trim(data.field.title),
                                eclassname: $.trim(data.field.etitle)
                            }

                            $.ajax({
                                type: "POST",
                                url: "/manage/changeclass",
                                dataType: "json",
                                data: post,
                                success: function (data) {
                                    if (data.ok === 200) {
                                        // targetParent('DownloadList')
                                        location.reload();
                                    } else {
                                        layer.msg(data.msg)
                                    }
                                }
                            });

                            return false;
                        })
                    })
                }
            });
        })
    });

})

//获取后缀名
function getFileType(name) {
    let dotindex = name.lastIndexOf('.');
    return name.substring(dotindex + 1, name.length)
}

//转换文件大小
function bytesToSize(bytes) {
    if (bytes === 0) return '0 B';
    let k = 1024, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
}