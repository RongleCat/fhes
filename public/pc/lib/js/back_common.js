let tools = {
  dateFormat(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) {
      return ''
    }
    if (typeof date === 'string') {
      date = new Date(date.replace(/-/g, '/'))
    }
    if (typeof date === 'number') {
      date = new Date(date)
    }
    var o = {
      'M+': date.getMonth() + 1,
      'D+': date.getDate(),
      'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    }
    var week = {
      '0': '\u65e5',
      '1': '\u4e00',
      '2': '\u4e8c',
      '3': '\u4e09',
      '4': '\u56db',
      '5': '\u4e94',
      '6': '\u516d'
    }
    if (/(Y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  },
  toMoney(s, dot) {
    if (/[^0-9\.]/.test(s)) return "invalid value";
    s = s.replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    if (dot) {
      s = s.replace(".", ".");
    } else {
      s = s.replace(".", ",");
    }
    var re = /(\d)(\d{3},)/;
    while (re.test(s))
      s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    return s.replace(/^\./, "0.")
  },
  toDouble(value) {
    var value = Math.round(parseFloat(value) * 100) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
      value = value.toString() + ".00";
      return value;
    }
    if (xsd.length > 1) {
      if (xsd[1].length < 2) {
        value = value.toString() + "0";
      }
      return value;
    }
  }
}
$(function () {
  //内容切换标签页
  $('[data-target]').on('click', function () {
    let target = $(this).data('target'),
      href = $(this).data('href');
    if (self != top) {
      let _parentEle = $(`#${target}`, parent.document)[0]
      $(_parentEle).parents('.layui-nav-item').addClass('layui-nav-itemed')
      top.location.hash = target
      _parentEle.click()
      // console.log($.cookie('Authorization'));
    } else {
      top.location.href = href
    }
  })
})

function targetParent(hashId) {
  let _parentEle = $(`#${hashId}`, parent.document)[0]
  $(_parentEle).parents('.layui-nav-item').addClass('layui-nav-itemed')
  top.location.hash = hashId
  _parentEle.click()
}