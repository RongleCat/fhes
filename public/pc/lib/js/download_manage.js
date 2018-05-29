const fileTypes = ['othe', 'zip', 'avi', 'swf', 'wav', 'txt', 'rmvb', 'xls', 'mkv', 'psd', 'exe', 'gif', 'pdf', 'mp4', 'ppt', 'png', 'mp3', 'jpg', 'doc']
$(function () {
    let table = layui.table;
    let options = {
        url: '/manage/getDownFileList',
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
                field: 'title',
                title: '中文标题'
            }, {
                field: 'entitle',
                title: '英文标题'
            }, {
                field: 'size',
                title: '文件大小'
            }, {
                field: 'type',
                title: '文件类型'
            }, {
                fixed: 'right',
                align: 'center',
                title: '操作',
                width: 180,
                field: 'filepath',
                templet(d) {
                    return `<a class="layui-btn layui-btn-primary layui-btn-xs" href="${d.filepath}?attname=" download>下载</a>
                    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>`
                }
            }]
        ]
    }
    let DownloadList = table.render(options);

    $('#btn-search').on('click', function (e) {
        let keyword = $('#ipt-keyword').val();
        options.where.keyword = keyword
        DownloadList.reload(options);
    })

    $('#btn-clear').on('click', function (e) {
        delete options.where.keyword
        $('#ipt-keyword').val('')
        DownloadList.reload(options);
    })

    $('#ipt-keyword').on('keypress', function (e) {
        if (e.keyCode === 13) {
            $('#btn-search').click();
        }
    })

    table.on('tool(demo)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        let data = obj.data; //获得当前行数据
        let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        let tr = obj.tr; //获得当前行 tr 的DOM对象
        if (layEvent === 'del') { //删除
            layer.confirm('真的要删除这个文件吗？', function (index) {
                // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                layer.close(index);
                $.ajax({
                    type: "POST",
                    url: "/manage/deleteDownFile",
                    dataType: "json",
                    data: {
                        id: data.id,
                        filepath: data.filepath
                    },
                    success: function (data) {
                        if (data.ok === 200) {
                            obj.del();
                        } else {
                            layer.msg(data.msg,()=>{})
                        }
                    }
                });
            });
        } else {
            $.ajax({
                type: "GET",
                url: "/manage/downFile",
                dataType: "json",
                data: {
                    id: data.id
                },
                success: function (res) {
                    console.log(res);
                }
            });
        }
    });

    layui.use('layer', function () {
        let layer = layui.layer;
        $('#btn-addfile').on('click', function () {
            let index = layer.open({
                type: 1,
                area: '500px',
                content: `<div class="addfile-container">
                <form class="layui-form layui-form-pane">
                    <div class="layui-form-item">
                        <label class="layui-form-label">中文标题</label>
                        <div class="layui-input-block">
                            <input type="text" name="title" lay-verify="" placeholder="请输入中文标题" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">英文标题</label>
                        <div class="layui-input-block">
                            <input type="text" name="entitle" lay-verify="" placeholder="请输入英文标题" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label upload-file">选择文件</label>
                        <div class="layui-input-block cover">
                            <div class="layui-upload-drag" id="upload-file">
                                <i class="layui-icon"></i>
                                <p>点击上传，或将文件拖拽到此处</p>
                                <span></span>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item btn-box">
                        <button class="layui-btn" lay-submit lay-filter="submit" id="btn-submit">立即提交</button>
                    </div>
                </form>
            </div>`,
                success(el, index) {
                    //初始化上传
                    let upload = layui.upload;
                    let post = {}
                    upload.render({
                        elem: '#upload-file',
                        url: '/manage/uploadDownFile',
                        accept: 'file',
                        done: function (res, index, upload) {
                            if (res.ok === 200) {
                                let fileType = getFileType(res.result['x:filename'])
                                if (fileTypes.indexOf(fileType) > -1) {
                                    post.type = fileType
                                } else {
                                    if (fileType === 'xlsx' || fileType === 'pptx' || fileType === 'docx') {
                                        post.type = fileType.substring(0, 3);
                                    } else {
                                        post.type = 'othe'
                                    }
                                }
                                post.size = bytesToSize(res.result['x:size'])
                                post.filepath = res.result['url']
                                $('#upload-file').find('span').text(`已上传 ${res.result.key}`)
                            } else {
                                upload();
                            }
                        }
                    });

                    layui.use('form', function () {
                        let form = layui.form;
                        form.on('submit(submit)', function (data) {
                            console.log(data);
                            if (!$.trim(data.field.title)) {
                                layer.msg('中文标题不能为空', () => {})
                                return false;
                            }
                            if (!$.trim(data.field.entitle)) {
                                layer.msg('英文标题不能为空', () => {})
                                return false;
                            }
                            post.title = data.field.title
                            post.entitle = data.field.entitle
                            if (!(post.filepath && post.size && post.type)) {
                                layer.msg('请上传文件！', () => {})
                                return false;
                            }

                            console.log(post);
                            $.ajax({
                                type: "POST",
                                url: "/manage/addDownFile",
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
                    el.on('click', '#btn-submit', function () {
                        console.log(111);
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
    var k = 1024, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
}