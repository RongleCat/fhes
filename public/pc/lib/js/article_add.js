
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
            for (var i in data.field) {
                if (!data.field[i]) {
                    delete data.field[i]
                }
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

            // console.log(data.field);
            // return false
            $.ajax({
                type: "POST",
                url: "/manage/addarticle",
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
    // console.log($('svg'));
    // setLoadingAnimation($('.img-upload-mask').eq(0));
    // setTimeout(() => {
    //     $('#loading-icon').find('use')[0].href.baseVal = '#icon-qie'
    // }, 1000);
})
