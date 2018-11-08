let fileurl = $('#upload-file').data('file');
let url = location.href.split('/');
let _id = null
let classid = null
let classname = null
if (url.indexOf('adderoduct') == -1) {
    _id = url[url.length - 1]
}
$(function () {
    var E = window.wangEditor
    var _menu = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'image', // 插入图片
        'table', // 表格
        'undo', // 撤销
        'redo' // 重复
    ]

    var upload = layui.upload;

    // 初始化封面上传
    let $cover = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: 'upload-cover',
        uptoken_url: '/manage/uptoken',
        domain: 'http://download.fhes.com/',
        filters: {
            mime_types: [
                //只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
                {
                    title: "图片文件",
                    extensions: "jpg,gif,png,bmp"
                }
            ]
        },
        max_file_size: '100mb', //最大文件体积限制
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        chunk_size: '4mb', //分块上传时，每片的体积
        auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
            'UploadProgress': function (up, file) {
                let $tip = $('#upload-cover').find('span');
                $tip.text('已上传 ' + $cover.total.percent + '%')
            },
            'FileUploaded': function (up, file, info) {
                let domain = up.getOption('domain');
                let res = $.parseJSON(info);
                let sourceLink = domain + res.key;

                if ($('.img-cover').length != 0) {
                    $('.img-cover')[0].src = sourceLink + ''
                } else {
                    $('#upload-cover').find('p').text('点击/拖拽更换产品主图图片').end().before(`<img src="${sourceLink}" class="img-cover">`)
                }

            },
            'Error': function (up, err, errTip) {
                //上传出错时,处理相关的事情
                printLog('on Error');
            }
        }
    });

    // 初始化视频封面上传
    let $videocover = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: 'upload-videocover',
        uptoken_url: '/manage/uptoken',
        domain: 'http://download.fhes.com/',
        filters: {
            mime_types: [
                //只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
                {
                    title: "图片文件",
                    extensions: "jpg,gif,png,bmp"
                }
            ]
        },
        max_file_size: '100mb', //最大文件体积限制
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        chunk_size: '4mb', //分块上传时，每片的体积
        auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
            'UploadProgress': function (up, file) {
                let $tip = $('#upload-videocover').find('span');
                $tip.text('已上传 ' + $videocover.total.percent + '%')
            },
            'FileUploaded': function (up, file, info) {
                let domain = up.getOption('domain');
                let res = $.parseJSON(info);
                let sourceLink = domain + res.key;

                if ($('.img-videocover').length != 0) {
                    $('.img-videocover')[0].src = sourceLink + ''
                } else {
                    $('#upload-videocover').find('p').text('点击/拖拽更换视频封面图片').end().before(`<img src="${sourceLink}" class="img-videocover">`)
                }

            },
            'Error': function (up, err, errTip) {
                //上传出错时,处理相关的事情
                printLog('on Error');
            }
        }
    });



    //详情页文档上传
    setTimeout(() => {
        let $file = Qiniu.uploader({
            runtimes: 'html5,flash,html4', //上传模式,依次退化
            browse_button: 'upload-file',
            uptoken_url: '/manage/uptoken?type=file',
            domain: 'http://download.fhes.com/',
            max_file_size: '100mb', //最大文件体积限制
            max_retries: 3, //上传失败最大重试次数
            dragdrop: true, //开启可拖曳上传
            chunk_size: '4mb', //分块上传时，每片的体积
            auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
            init: {
                'FilesAdded': function (up, files) {
                    console.log(up);
                },
                'UploadProgress': function (up, file) {
                    let $tip = $('#upload-file').find('span');
                    $tip.text('已上传 ' + $file.total.percent + '%')
                },
                'FileUploaded': function (up, file, info) {
                    let domain = up.getOption('domain');
                    let res = $.parseJSON(info);
                    let sourceLink = domain + res.key;

                    console.log(res);
                    fileurl = sourceLink
                    $('#upload-file').find('span').text(`已上传 ${res.key}`)

                    post.size = bytesToSize(file.size);
                    post.filepath = sourceLink
                },
                'Error': function (up, err, errTip) {
                    //上传出错时,处理相关的事情
                    printLog('on Error');
                }
            }
        });
    }, 100);


    //初始化文本编辑器
    var zhContent = new E('#zhContent')
    zhContent.customConfig.onfocus = function () {
        $(zhContent.toolbarSelector).addClass('focus')
    }
    zhContent.customConfig.onblur = function () {
        $(zhContent.toolbarSelector).removeClass('focus')
    }
    zhContent.customConfig.menus = _menu

    var enContent = new E('#enContent')
    enContent.customConfig.onfocus = function () {
        $(enContent.toolbarSelector).addClass('focus')
    }
    enContent.customConfig.onblur = function () {
        $(enContent.toolbarSelector).removeClass('focus')
    }
    enContent.customConfig.menus = _menu

    zhContent.create()
    enContent.create()


    uploadInit(zhContent)
    uploadInit(enContent);




    layui.use('form', function () {
        var form = layui.form;

        $('#btn-submit-top').on('click', function () {
            $('#btn-submit').click();
        })

        $('#btn-reset-top').on('click', function () {
            $('#btn-reset').click();
        })

        form.on('select(class)', function (data) {
            $(data.elem).find('option').map((index, item) => {
                if ($(item).attr('value') == data.value) {
                    window.classname = $(item).text()
                }
            })
            classid = data.value
        });

        form.on('submit(submit)', function (data) {
            let content = zhContent.txt.html();
            let encontent = enContent.txt.html();
            let cover = $('.img-cover').attr('src')
            let videocover = $('.img-videocover').attr('src')

            if (_id) {
                data.field.id = _id
            }
            console.log(data.field);


            if (!cover) {
                layer.msg('必须添加产品主图图片', () => {})
                return false;
            } else {
                data.field.cover = cover
            }

            if (videocover) {
                data.field.videocover = videocover
            } else {
                data.field.videocover = ''
            }

            if (fileurl) {
                data.field.file = fileurl
            } else {
                data.field.file = ''
            }

            if (data.field.video) {
                if (!videocover) {
                    layer.msg('必须添加视频封面图片', () => {})
                    return false;
                }
            }

            if (!classid) {
                layer.msg('必须选择产品所属分类', () => {})
                return false;
            } else {
                data.field.classid = classid
                data.field.classname = classname
            }

            if (zhContent.txt.text()) {
                data.field.content = content;
            }

            if (enContent.txt.text()) {
                data.field.encontent = encontent;
            }

            if (!data.field.title) {
                layer.msg('中文标题不能为空', () => {})
                return false;
            }

            if (!data.field.entitle) {
                layer.msg('英文标题不能为空', () => {})
                return false;
            }

            if (!data.field.content) {
                layer.msg('中文内容不能为空', () => {})
                return false;
            }

            if (!data.field.encontent) {
                layer.msg('英文内容不能为空', () => {})
                return false;
            }


            // console.log(data.field);
            // return false
            if (_id) {
                $.ajax({
                    type: "POST",
                    url: "/manage/editproduct",
                    dataType: "json",
                    data: data.field,
                    success: function (data) {
                        if (data.ok === 200) {
                            targetParent('productmanage')
                        } else {
                            alert(data.msg)
                        }
                    }
                });
            } else {
                $.ajax({
                    type: "POST",
                    url: "/manage/addproduct",
                    dataType: "json",
                    data: data.field,
                    success: function (data) {
                        if (data.ok === 200) {
                            targetParent('productmanage')
                        } else {
                            alert(data.msg)
                        }
                    }
                });
            }
            return false;
        });
    });

    $('#btn-reset').on('click', function (e) {
        e.preventDefault();
        $('input[type="text"]').val('')
        zhContent.txt.clear()
        enContent.txt.clear()
        fileurl = null
        $('#upload-file span').text('')
        $('.img-videocover').remove()
        $('.img-cover').remove()
        classid = null
    })

    $('#btn-delete-file').on('click', function (e) {
        e.preventDefault();
        fileurl = null
        $('#upload-file span').text('')
    })

    $('#btn-delete-cover').on('click', function (e) {
        e.preventDefault();
        $('.img-cover').remove()
    })

    $('#btn-delete-videocover').on('click', function (e) {
        e.preventDefault();
        $('.img-videocover').remove()
    })


    // $(window).bind('beforeunload', function () {
    //     return '';
    // });
    // console.log($('svg'));
    // setLoadingAnimation($('.img-upload').eq(0));
    // setTimeout(() => {
    //     $('#loading-icon').find('use')[0].href.baseVal = '#icon-qie'
    // }, 1000);
})

//转换文件大小
function bytesToSize(bytes) {
    if (bytes === 0) return '0 B';
    let k = 1024, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
}