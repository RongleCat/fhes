const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const fs = require('fs')
const ctrl = require('../controllers/webpc')
const ctrlmanage = require('../controllers/manage')
const utils = require('./utils')
const lang = require('../public/i18n/lang')
let dev = true
// console.log(lang);
/* GET home page. */
router.use((req, res, next) => {
  let client_lang = req.cookies.lang || 'zh';
  let devparam = ''
  if (dev) {
    devparam = '?id=' + Math.random();
  }
  req.returnData = {
    lang: lang[client_lang],
    dev: devparam,
    client_lang,
    isMobile: ismobile(req.headers['user-agent'])
  }
  req.returnData.navActive = req.originalUrl.split('?')[0]
  if (req.originalUrl != '/') {
    req.returnData.other = true
  }
  next()
})

//首页新闻接口
router.get('/', function (req, res, next) {
  let rule = ''
  let language = ''
  if (req.returnData.client_lang === 'zh') {
    language = '10'
  } else {
    language = '01'
  }
  if (language !== '11' && language !== '00' && language) {
    rule += `home = '1' and (language like '${language.replace('0', '%')}') `
  }
  ctrl.getHomeNewsList({
    rule,
    start: 0,
    limit: 100
  }, (result) => {
    result.data.forEach(element => {
      if (element.content) {
        element.content = removeTAG(element.content).substr(0, 48) + '...'
      }
      if (element.encontent) {
        element.encontent = removeTAG(element.encontent).substr(0, 50) + '...'
      }
    });
    req.returnData.newsList = result.data

    if (!req.returnData.isMobile) {
      console.log(req.returnData);
      res.render('Pc/Index', req.returnData);
    } else {
      res.render('Wap/Index', req.returnData);
    }
  })
});

//新闻详情页面
router.get('/news/:id', function (req, res, next) {
  ctrl.getNewsDetail({
    id: parseInt(req.params.id)
  }, result => {
    // console.log(result);
    req.returnData.detail = result[0]
    if (!req.returnData.isMobile) {
      res.render('Pc/NewDetail', req.returnData);
    } else {
      res.render('Wap/NewDetail', req.returnData);
    }
  }).catch(err => {
    console.log(err);
    res.render('error', err);
  })
});

//关于我们页面
router.get('/about', (req, res, next) => {
  if (req.returnData.isMobile) {
    res.render('Wap/About', req.returnData);
  } else {
    let rule = ''
    let language = ''
    if (req.returnData.client_lang === 'zh') {
      language = '10'
    } else {
      language = '01'
    }
    if (language !== '11' && language !== '00' && language) {
      rule += `home = '1' and (language like '${language.replace('0', '%')}') `
    }
    ctrl.getHomeNewsList({
      rule,
      start: 0,
      limit: 10
    }, (result) => {
      result.data.forEach(element => {
        if (element.content) {
          element.content = removeTAG(element.content).substr(0, 48) + '...'
        }
        if (element.encontent) {
          element.encontent = removeTAG(element.encontent).substr(0, 50) + '...'
        }
      });
      req.returnData.newsList = result.data
      res.render('Pc/About', req.returnData);
    })
  }
})
//产品分类页面
router.get('/class', (req, res, next) => {
  res.render('Pc/Class', req.returnData);
})

//解决方案页面
router.get('/solution', (req, res, next) => {
  if (!req.returnData.isMobile) {
    res.render('Pc/Solution', req.returnData);
  } else {
    res.render('Wap/Solution', req.returnData);
  }
})
//产品详情页面
router.get('/class/:id', (req, res, next) => {
  ctrl.getDetail({
    id: parseInt(req.params.id)
  }).then(result => {
    req.returnData.detail = result[0]
    if (!req.returnData.isMobile) {
      res.render('Pc/ClassDetail', req.returnData);
    } else {
      res.render('Wap/ClassDetail', req.returnData);
    }
  }).catch(err => {
    res.render('error', err);
  })
})
//解决方案详情页面
router.get('/solution/:id', (req, res, next) => {
  ctrl.getDetail({
    id: parseInt(req.params.id)
  }).then(result => {
    req.returnData.detail = result[0]
    if (!req.returnData.isMobile) {
      res.render('Pc/ClassDetail', req.returnData);
    } else {
      res.render('Wap/ClassDetail', req.returnData);
    }
  }).catch(err => {
    res.render('error', err);
  })
})
//市场开发页面
router.get('/market', (req, res, next) => {
  if (!req.returnData.isMobile) {
    res.render('Pc/Market', req.returnData);
  } else {
    res.render('Wap/Market', req.returnData);
  }
})
//服务支持页面
router.get('/service', (req, res, next) => {
  ctrl.getService({
    id: 1
  }).then(result => {
    req.returnData.detail = result[0]
    res.render('Pc/Service', req.returnData);
  }).catch(err => {
    res.render('error', err);
  })
})
//文档下载页面
router.get('/download', (req, res, next) => {
  ctrl.getDownCount().then((result) => {
    req.returnData.downCount = result.length
    res.render('Pc/Download', req.returnData);
  })
})

//文档下载列表内容
router.get('/getDownFileList', function (req, res, next) {
  let param = req.query;
  let rule = '';
  ctrlmanage.getDownFileList({
    rule,
    start: (param.page - 1) * param.limit,
    limit: param.limit
  }, (result) => {
    result.ok = 200;
    result.msg = '查询成功！',
      result.lang = req.returnData.client_lang
    res.json(result);
  })
});


//方法

function removeTAG(str) {
  return str.replace(/<[^>]+>/g, "");
}

function ismobile(ua) {
  let isMobile = {
    Android: function () {
      return /Android/i.test(ua);
    },
    BlackBerry: function () {
      return /BlackBerry/i.test(ua);
    },
    iOS: function () {
      return /iPhone|iPad|iPod/i.test(ua);
    },
    Windows: function () {
      return /IEMobile/i.test(ua);
    },
    any: function () {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
  };
  return isMobile.any();
}

function removeStyle(str) {
  let reg = /style="[^"]*"/g;
  return str.replace(reg, '');
}

module.exports = router;