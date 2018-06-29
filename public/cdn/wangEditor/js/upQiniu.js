function uploadInit(editor) {
    let btnId = editor.imgMenuId;
    let containerId = editor.toolbarElemId;
    let textElemId = editor.textElemId;
    let mask = {};

    // 创建上传对象
    let uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: btnId, //上传选择的点选按钮，**必需**
        uptoken_url: '/manage/uptoken',
        //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        // uptoken : '<Your upload token>',
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        // unique_names: true,
        // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        // save_key: true,
        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://images.fhes.com/',
        //bucket 域名，下载资源时用到，**必需**
        container: containerId, //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '100mb', //最大文件体积限制
        flash_swf_url: './Moxie.swf', //引入flash,相对路径
        filters: {
            mime_types: [
                //只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
                {
                    title: "图片文件",
                    extensions: "jpg,gif,png,bmp"
                }
            ]
        },
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        drop_element: textElemId, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb', //分块上传时，每片的体积
        auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
            'FilesAdded': function(up, files) {
                mask = createLoadingLayer(editor.toolbarSelector)
                mask.progress = mask.parent.find('.progress-bgcolor')
                mask.icon = mask.parent.find('use')[0]
                mask.textP = mask.parent.find('.progress-text')
                setLoadingAnimation(mask.icon, mask.iconList, containerId)
            },
            'UploadProgress': function (up, file) {
                printLog('进度 ' + uploader.total.percent)
                mask.progress.css('width', uploader.total.percent + '%')
                mask.textP.text(`正在上传图片(${uploader.total.percent}%)`)
            },
            'FileUploaded': function (up, file, info) {
                // 每个文件上传成功后,处理相关的事情
                // 其中 info 是文件上传成功后，服务端返回的json，形式如
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                printLog(info);
                // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                let domain = up.getOption('domain');
                let res = $.parseJSON(info);
                let sourceLink = domain + res.key; //获取上传成功后的文件的Url

                printLog(sourceLink);

                // 插入图片到editor
                editor.cmd.do('insertHtml', '<img src="' + sourceLink + '" style="max-width:100%;"/>')
            },
            'Error': function (up, err, errTip) {
                //上传出错时,处理相关的事情
                printLog('on Error');
            },
            'UploadComplete': function () {
                window.clearInterval(window[containerId + '_loading']);
                mask.parent.find('.img-upload-mask').remove();
            }
            // Key 函数如果有需要自行配置，无特殊需要请注释
            //,
            // 'Key': function(up, file) {
            //     // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            //     // 该配置必须要在 unique_names: false , save_key: false 时才生效
            //     let key = "";
            //     // do something with key here
            //     return key
            // }
        }
    });
    // domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
    // uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
}

// 封装 console.log 函数
function printLog(title, info) {
    window.console && console.log(title, info);
}

//获取所有svg图标id
function getSVGIconList() {
    let list = [];
    $('svg symbol').map((index, item) => {
        list.push(item.id)
    })
    return list
}

//添加icon图标，并设置动画
function setLoadingAnimation($el, iconList, containerId) {
    window[containerId + '_loading'] = setInterval(() => {
        $el.href.baseVal = `#${iconList[Math.floor(Math.random()*iconList.length)]}`
    }, 1000)
}

function createLoadingLayer(editorId) {
    let iconList = getSVGIconList();
    let $parent = $(editorId).parent();
    $parent.append(`<div class="img-upload-mask">
        <svg class="icon loading-icon" aria-hidden="true">
            <use xlink:href="#${iconList[Math.floor(Math.random()*iconList.length)]}"></use>
        </svg>
        <p class="progress-text">正在上传图片</p>
        <div class="progress-container">
            <div class="progress-bgcolor"></div>
        </div>
    </div>`)
    return {
        parent: $parent,
        iconList
    }
}