const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const fs = require('fs')
const ctrl = require('../controllers/manage')
const ctrlWeb = require('../controllers/webpc')
const utils = require('./utils')
const qiniu = require('qiniu');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const qn = require('qn');
const path = require('path');

let config = {
  accessKey: '_7FzMf-18W0voaEVxQiPiNPnp7RTqb-g_Z5pszO9', // 此处填写自己申请的 ACCESS_KEY
  secretKey: 'raFS99akPMzVgNCs7FrLHaVp1_nvRjTE-HHdI0mv' // 此处填写自己申请的 SECRET_KEY
}

let newsCover = qn.create({
  accessKey: config.accessKey, // 此处填写自己申请的 ACCESS_KEY
  secretKey: config.secretKey, // 此处填写自己申请的 SECRET_KEY
  bucket: 'fhesimages',
  origin: 'http://p8wnfmuiu.bkt.clouddn.com'
})

let downloadFile = qn.create({
  accessKey: config.accessKey, // 此处填写自己申请的 ACCESS_KEY
  secretKey: config.secretKey, // 此处填写自己申请的 SECRET_KEY
  bucket: 'downloadfiles',
  origin: 'http://p9gz545fl.bkt.clouddn.com'
})


qiniu.conf.ACCESS_KEY = config.accessKey;
qiniu.conf.SECRET_KEY = config.secretKey;

let uptoken = new qiniu.rs.PutPolicy({
  scope: 'fhesimages',
  expires: 100000
});
// console.log(uptoken.uploadToken());

//检测是否含有非法字符及登录权限验证跳转
router.use(function (req, res, next) {
  if (req.method === 'POST') {
    let r = [];
    for (var i in req.body) {
      if (i.indexOf('content') == -1) {
        if (/[@#\$<>%\^&\*]+/g.test(req.body[i])) {
          res.json({
            ok: 0,
            msg: '您提交的内容含有非法字符！'
          })
          return false;
        }
      }
    }
    next();
  } else {
    if (req.url === '/login') {
      verifyToken(req, res, function (r) {
        req.verifyData = r
        next()
      }, true)
    } else {
      verifyToken(req, res, function (r) {
        req.verifyData = r
        next()
      })
    }
  }
});

//后台框架页
router.get('/', function (req, res, next) {
  res.render('Manage/Main', req.verifyData.data);
});

//后台首页
router.get('/index', function (req, res, next) {
  res.render('Manage/Index', req.verifyData.data);
});

//文章列表页面
router.get('/article', function (req, res, next) {
  res.render('Manage/Article', req.verifyData.data);
});

//添加文章页面
router.get('/addarticle', function (req, res, next) {
  res.render('Manage/AddArticle', req.verifyData.data);
});

//文档下载管理页面

router.get('/download', (req, res, next) => {
  res.render('Manage/Download')
})



//编辑详情页内容页面
router.get('/editdetail/:id', function (req, res, next) {
  ctrlWeb.getDetail({
    id: parseInt(req.params.id)
  }).then(result => {
    if (result[0].file) {
      let file = result[0].file.split('/')
      result[0].filename = file[file.length - 1]
    }
    res.render('Manage/editDetail', result[0]);
  }).catch(err => {
    console.log(err);
    res.render('error', err);
  })
});


//修改文章页面
router.get('/editarticle/:id', function (req, res, next) {
  ctrlWeb.getNewsDetail({
    id: parseInt(req.params.id)
  }, result => {
    res.render('Manage/EditArticle', result[0]);
  }).catch(err => {
    console.log(err);
    res.render('error', err);
  })
});


//添加文章接口
router.post('/addarticle', function (req, res, next) {
  let body = req.body;
  body.edittime = utils.dateFormat(new Date());
  ctrl.addArticle(body).then(result => {
    res.json({
      ok: 200,
      data: result
    })
  }).catch(err => {
    res.json({
      ok: 0,
      data: err,
      msg: '文章保存失败'
    })
  });
});

//修改文章接口
router.post('/editarticle', function (req, res, next) {
  let body = req.body;
  body.edittime = utils.dateFormat(new Date());
  let params = {
    id: body.id,
    data: body
  }
  body.edittime = utils.dateFormat(new Date());
  ctrl.updateArticle(params).then(result => {
    res.json({
      ok: 200,
      data: result
    })
  }).catch(err => {
    res.json({
      ok: 0,
      data: err,
      msg: '文章保存失败'
    })
  });
});

//修改详情页接口
router.post('/editdetail', function (req, res, next) {
  let body = req.body;
  let params = {
    id: body.id,
    data: body
  }
  ctrl.updateDetail(params).then(result => {
    res.json({
      ok: 200,
      data: result
    })
  }).catch(err => {
    res.json({
      ok: 0,
      data: err,
      msg: '详情页保存失败'
    })
  });
});


//上传新闻封面接口
router.post('/uploadNewsCover', multipartMiddleware, (req, res, next) => {
  // console.log(req.files.file);
  newsCover.uploadFile(req.files.file.path, {
    key: req.files.file.originalFilename
  }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.json({
        ok: 200,
        result
      })
    }
  });
})


//添加文件接口
router.post('/addDownFile', function (req, res, next) {
  let body = req.body;
  ctrl.addDownFile(body).then(result => {
    res.json({
      ok: 200,
      data: result
    })
  }).catch(err => {
    res.json({
      ok: 0,
      data: err,
      msg: '文章保存失败'
    })
  });
});

//上传下载文档接口
router.post('/uploadDownFile', multipartMiddleware, (req, res, next) => {
  // console.log(req.files.file);
  downloadFile.uploadFile(req.files.file.path, {
    key: req.files.file.originalFilename
  }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.json({
        ok: 200,
        result
      })
    }
  });
})


//获取七牛上传token接口
router.get('/uptoken', function (req, res, next) {
  var token = uptoken.uploadToken();
  res.header("Cache-Control", "max-age=0, private, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  if (token) {
    res.json({
      uptoken: token
    });
  }
});

//删除文章接口
router.post('/deletearticle', function (req, res, next) {
  let body = req.body;
  body.id = parseInt(body.id);
  ctrl.deleteArticle(body).then(result => {
    res.json({
      ok: 200,
      data: result
    })
  }).catch(err => {
    console.log(err);
    res.json({
      ok: 0,
      data: err,
      msg: '文章删除失败'
    })
  });
});

//删除文件接口
router.post('/deleteDownFile', function (req, res, next) {
  let body = req.body;
  body.id = parseInt(body.id);
  let filename = body.filepath.split('/');
  ctrl.deleteDownFile(body).then(result => {
    downloadFile.delete(filename[filename.length - 1], err => {
      if (err) {
        console.log(err);
      } else {
        res.json({
          ok: 200,
          data: result
        })
      }
    })
  }).catch(err => {
    res.json({
      ok: 0,
      data: err,
      msg: '文章删除失败'
    })
  });
});

//文章列表内容
router.get('/getArticleList', function (req, res, next) {
  let param = req.query;
  let rule = '';
  if (param.language !== '11' && param.language !== '00' && param.language) {
    rule += `language like '${param.language.replace('0', '%')}' `
  }
  if (param.keyword) {
    if (rule == '') {
      rule += `title like '%${param.keyword}%' or entitle like '%${param.keyword}%'`
    } else {
      rule += `and (title like '%${param.keyword}%' or entitle like '%${param.keyword}%')`
    }
  }
  ctrl.getArticleList({
    rule,
    start: (param.page - 1) * param.limit,
    limit: parseInt(param.limit)
  }, (result) => {
    result.code = 0;
    result.msg = '查询成功！'
    res.json(result);
  })
});

router.get('/downFile', (req, res, next) => {
  let param = req.query
  ctrl.getFilePath(param, result => {
    res.download(result[0].filepath)
  })
})


//文件列表内容
router.get('/getDownFileList', function (req, res, next) {
  let param = req.query;
  let rule = '';
  if (param.keyword) {
    if (rule == '') {
      rule += `title like '%${param.keyword}%' or entitle like '%${param.keyword}%'`
    } else {
      rule += `and (title like '%${param.keyword}%' or entitle like '%${param.keyword}%')`
    }
  }
  ctrl.getDownFileList({
    rule,
    start: (param.page - 1) * param.limit,
    limit: parseInt(param.limit)
  }, (result) => {
    result.code = 0;
    result.msg = '查询成功！'
    res.json(result);
  })
});

//登录页
router.get('/login', function (req, res, next) {
  let verifyData = req.verifyData;
  if (verifyData.ok === 200) {
    res.redirect(302, '/manage');
  } else {
    res.render('Manage/Login')
  }
});

//登录页=接口
router.post('/login', function (req, res, next) {
  let body = req.body;
  ctrl.verifyAdmin(body, result => {
    if (result.length !== 0 && result.length === 1) {
      // createToken(ctx, res[0])
      res.json({
        ok: 200,
        msg: '登录成功！',
        token: createToken(res, result[0])
      })
    } else {
      res.json({
        ok: 0,
        msg: '用户名或密码错误！'
      })
    }
  })
});

//创建token并向客户端设置最新token
function createToken(res, data) {
  let cert = fs.readFileSync('cert/private.key')
  let token = jwt.sign(data, cert, {
    algorithm: 'RS256',
    expiresIn: '30m'
  })
  res.cookie('Authorization', token)
  return token
}

//验证当前请求的客户端token
function verifyToken(req, res, callback, type) {
  //获取客户端token
  let token = req.cookies.Authorization
  //获取证书公钥
  let cert = fs.readFileSync('cert/public.key')
  return new Promise((rok, rno) => {
      jwt.verify(token, cert, function (err, decoded) {
        if (err) {
          //验证失败判断是否是登录页面
          if (!type) {
            rno({
              ok: 0,
              data: err
            })
          } else {
            rok({
              ok: 0,
              data: err
            })
          }
        } else {
          //验证成功刷新客户端token，保持登录状态
          let {
            id,
            username,
            password,
            createtime
          } = decoded
          createToken(res, {
            id,
            username,
            password,
            createtime
          })
          rok({
            ok: 200,
            data: decoded
          })
        }
      })
    })
    //验证成功执行回调
    .then(r => {
      if (callback) {
        callback(r)
      }
    })
    //验证失败返回登录页
    .catch(r => {
      res.redirect(302, '/manage/login')
    })
}

function randomString(len, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

module.exports = router;