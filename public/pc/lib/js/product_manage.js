const fileTypes = ['othe', 'zip', 'avi', 'swf', 'wav', 'txt', 'rmvb', 'xls', 'mkv', 'psd', 'exe', 'gif', 'pdf', 'mp4', 'ppt', 'png', 'mp3', 'jpg', 'doc']
$(function () {
  let table = layui.table;
  let options = {
    url: '/manage/getProductList',
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
        field: 'cover',
        title: '封面图片',
        width: 130,
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
        field: 'classname',
        title: '所属分类'
      }, {
        fixed: 'right',
        align: 'center',
        title: '操作',
        width: 180,
        field: 'filepath',
        templet(d) {
          return `<a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="detail">查看</a>
          <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
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

  layui.use('form', function(){
    var form = layui.form;
    form.on('select(class)', function(data){
      options.where.classid = data.value
      DownloadList.reload(options);
    });    
  });
  

  table.on('tool(demo)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
    let $data = obj.data; //获得当前行数据
    let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
    let tr = obj.tr; //获得当前行 tr 的DOM对象
    if (layEvent === 'del') { //删除
      layer.confirm('真的要删除这个产品吗？', function (index) {
        // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
        layer.close(index);
        $.ajax({
          type: "POST",
          url: "/manage/deleteproduc",
          dataType: "json",
          data: {
            id: $data.id
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
    } else if (layEvent == 'detail') {
      console.log('查看');
    } else {
      location.href='/manage/editeroduct/'+$data.id
    }
  });
})


$('#btn-addfile').on('click',function (){
    location.href='/manage/adderoduct'
})
