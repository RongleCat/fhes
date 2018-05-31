let fileurl = $('#upload-file').data('file');
let url = location.href.split('/');
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

    //初始化封面上传
    upload.render({
        elem: '#upload-cover',
        url: '/manage/uploadNewsCover',
        accept: 'images',
        acceptMime: 'image/*',
        done: function (res) {
            if (res.ok === 200) {
                if ($('.img-cover').length != 0) {
                    $('.img-cover')[0].src = res.result.url + '-mask'
                } else {
                    $('#upload-cover').find('p').text('点击/拖拽更换视频封面图片').end().before(`<img src="${res.result.url}-mask" class="img-cover">`)
                }
            }
        }
    });

    //详情页文档上传
    upload.render({
        elem: '#upload-file',
        url: '/manage/uploadDownFile',
        accept: 'file',
        done: function (res, index, upload) {
            if (res.ok === 200) {
                console.log(res);
                fileurl = res.result.url
                $('#upload-file').find('span').text(`已上传 ${res.result.key}`)
            } else {
                upload();
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

        $('#btn-submit-top').on('click', function () {
            $('#btn-submit').click();
        })

        $('#btn-reset-top').on('click', function () {
            $('#btn-reset').click();
        })

        form.on('submit(submit)', function (data) {
            let content = zhContent.txt.html();
            let encontent = enContent.txt.html();
            let cover = $('.img-cover').attr('src')
            data.field.id = url[url.length-1]
            console.log(data.field);

            if (cover) {
                data.field.videocover = cover
            }else{
                data.field.videocover = ''
            }

            if (fileurl) {
                data.field.file = fileurl
            }else{
                data.field.file = ''
            }

            if (data.field.video) {
                if (!cover) {
                    layer.msg('必须添加视频封面图片', () => {})
                    return false;
                }
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
            $.ajax({
                type: "POST",
                url: "/manage/editdetail",
                dataType: "json",
                data: data.field,
                success: function (data) {
                    if (data.ok === 200) {
                        targetParent('/manage',true)
                    } else {
                        alert(data.msg)
                    }
                }
            });
            return false;
        });
    });

    $('#btn-reset').on('click',function (e){
        e.preventDefault();
        $('input[type="text"]').val('')
        zhContent.txt.clear()
        enContent.txt.clear()
        fileurl = null
        $('#upload-file span').text('')
        $('.img-cover').remove()
    })

    $('#btn-delete-file').on('click',function (e){
        e.preventDefault();
        fileurl = null
        $('#upload-file span').text('')
    })

    $('#btn-delete-cover').on('click',function (e){
        e.preventDefault();
        $('.img-cover').remove()
    })


    // $(window).bind('beforeunload', function () {
    //     return '';
    // });
    // console.log($('svg'));
    // setLoadingAnimation($('.img-upload-mask').eq(0));
    // setTimeout(() => {
    //     $('#loading-icon').find('use')[0].href.baseVal = '#icon-qie'
    // }, 1000);
})