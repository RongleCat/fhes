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

    //初始化文本编辑器
    var $one = new E('#one')
    $one.customConfig.onfocus = function () {
        $($one.toolbarSelector).addClass('focus')
    }
    $one.customConfig.onblur = function () {
        $($one.toolbarSelector).removeClass('focus')
    }
    $one.customConfig.menus = _menu



    var $two = new E('#two')
    $two.customConfig.onfocus = function () {
        $($two.toolbarSelector).addClass('focus')
    }
    $two.customConfig.onblur = function () {
        $($two.toolbarSelector).removeClass('focus')
    }
    $two.customConfig.menus = _menu


    var $three = new E('#three')
    $three.customConfig.onfocus = function () {
        $($three.toolbarSelector).addClass('focus')
    }
    $three.customConfig.onblur = function () {
        $($three.toolbarSelector).removeClass('focus')
    }
    $three.customConfig.menus = _menu


    var $fore = new E('#fore')
    $fore.customConfig.onfocus = function () {
        $($fore.toolbarSelector).addClass('focus')
    }
    $fore.customConfig.onblur = function () {
        $($fore.toolbarSelector).removeClass('focus')
    }
    $fore.customConfig.menus = _menu

    $one.create()
    $two.create()
    $three.create()
    $fore.create()

    uploadInit($one)
    uploadInit($two)
    uploadInit($three)
    uploadInit($fore)


    layui.use('form', function () {
        var form = layui.form;
        $('#btn-submit-top').on('click', function () {
            $('#btn-submit').click();
        })

        $('#btn-reset-top').on('click', function () {
            $('#btn-reset').click();
        })

        form.on('submit(submit)', function (data) {
            var _one = $one.txt.html();
            var _two = $two.txt.html();
            var _three = $three.txt.html();
            var _fore = $fore.txt.html();

            // console.log(data.field);
            // return false
            $.ajax({
                type: "POST",
                url: "/manage/editservice",
                dataType: "json",
                data: {
                    onecontent: _one,
                    twocontent:_two,
                    threecontent:_three,
                    forecontent:_fore
                },
                success: function (data) {
                    if (data.ok === 200) {
                        targetParent('/manage', true)
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

    $('#btn-reset').on('click', function (e) {
        e.preventDefault();
        one.txt.clear()
        two.txt.clear()
        three.txt.clear()
        fore.txt.clear()
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