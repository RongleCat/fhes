$(function (){
    //内容切换标签页
    $('[data-target]').on('click',function (){
        let target = $(this).data('target'),href = $(this).data('href');
        if (self != top) {
            let _parentEle = $(`#${target}`, parent.document)[0]
            $(_parentEle).parents('.layui-nav-item').addClass('layui-nav-itemed')
            _parentEle.click()
        }else{
            top.location.href = href
        }
    })
})