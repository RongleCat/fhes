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



    let $cover = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: 'upload-cover',
        uptoken_url: '/manage/uptoken',
        domain: 'http://images.fhes.com/',
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
                    $('.img-cover')[0].src = sourceLink + '-mask'
                } else {
                    $('#upload-cover').find('p').text('点击/拖拽更换封面图片').end().before(`<img src="${sourceLink}-mask" class="img-cover">`)
                }

            },
            'Error': function (up, err, errTip) {
                //上传出错时,处理相关的事情
                printLog('on Error');
            }
        }
    });

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
    uploadInit(enContent)

    layui.use('form', function () {
        var form = layui.form;
        form.on('submit(submit)', function (data) {
            let content = zhContent.txt.html();
            let encontent = enContent.txt.html();
            let cover = $('.img-cover').attr('src')

            for (var i in data.field) {
                if (!data.field[i]) {
                    delete data.field[i]
                }
            }
            data.field.id = $('.img-cover').attr('data-id')
            if (!cover) {
                layer.msg('请先上传封面图片')
                return false;
            }else{
                data.field.cover = cover
            }

            if (zhContent.txt.text()) {
                data.field.content = content;
            }

            if (enContent.txt.text()) {
                data.field.encontent = encontent;
            }
            if ($('#openEn')[0].checked) {
                if (!(data.field.title || data.field.entitle)) {
                    layer.msg('中文标题和英文标题不能都为空')
                    return false;
                }
                if (data.field.entitle) {
                    if (!data.field.encontent) {
                        layer.msg('有英文标题必须有英文内容')
                        return false;
                    }
                }
                if (data.field.encontent) {
                    if (!data.field.entitle) {
                        layer.msg('有英文内容必须有英文标题')
                    }
                }
            } else {
                if (!data.field.title) {
                    layer.msg('标题不能为空')
                    return false;
                }
            }
            if (data.field.title) {
                if (!data.field.content) {
                    layer.msg('有中文标题必须有中文内容')
                    return false;
                }
            }
            if (data.field.content) {
                if (!data.field.title) {
                    layer.msg('有中文内容必须有中文标题')
                    return false;
                }
            }

            if (!$('#openEn')[0].checked) {
                delete data.field.encontent
                delete data.field.entitle
                delete data.field.ensubtitle
            }

            if (data.field.title && data.field.entitle) {
                data.field.language = '11'
            } else if (data.field.title && !data.field.entitle) {
                data.field.language = '10'
            } else {
                data.field.language = '01'
            }

            $.ajax({
                type: "POST",
                url: "/manage/editarticle",
                dataType: "json",
                data: data.field,
                success: function (data) {
                    if (data.ok === 200) {
                        targetParent('articleList')
                    } else {
                        alert(data.msg)
                    }
                }
            });
            return false;
        });
        form.on('switch(addEn)', function (data) {
            if (data.elem.checked) {
                $('.en-block').fadeIn('fast')
            } else {
                $('.en-block').fadeOut('fast')
            }
        });
    });
    // $(window).bind('beforeunload', function () {
    //     return '';
    // });
})