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
  origin: 'http://images.fhes.com/'
})

let downloadFile = qn.create({
  accessKey: config.accessKey, // 此处填写自己申请的 ACCESS_KEY
  secretKey: config.secretKey, // 此处填写自己申请的 SECRET_KEY
  bucket: 'downloadfiles',
  origin: 'http://dwonload.fhes.com/'
})


qiniu.conf.ACCESS_KEY = config.accessKey;
qiniu.conf.SECRET_KEY = config.secretKey;

let uptoken = new qiniu.rs.PutPolicy({
  scope: 'fhesimages',
  expires: 100000
});

let downtoken = new qiniu.rs.PutPolicy({
  scope: 'downloadfiles',
  expires: 100000
});

// console.log(uptoken.uploadToken());

//检测是否含有非法字符及登录权限验证跳转
router.use(function (req, res, next) {
  if (req.method === 'POST') {
    let r = [];
    for (var i in req.body) {
      if (i.indexOf('content') == -1 && i.indexOf('style') == -1 && i.indexOf('range') == -1 && i.indexOf('param') == -1) {
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

//产品分类管理页面
router.get('/classmanage', function (req, res, next) {
  res.render('Manage/ClassManage', req.verifyData.data);
});

//产品列表页面
router.get('/productmanage', function (req, res, next) {
  ctrl.classManage.getList().then(r => {
    res.render('Manage/ProductManage', {
      product: r
    });
  })
});

//添加产品页面
router.get('/adderoduct', function (req, res, next) {
  ctrl.classManage.getList().then(r => {
    res.render('Manage/EditProduct', {
      product: r
    });
  })
});

//添加产品接口
router.post('/addproduct', function (req, res, next) {
  let body = req.body;
  console.log(body);
  ctrl.productManage.change(body).then(result => {
    res.json({
      ok: 200,
      data: result
    })
  }).catch(err => {
    console.log(err);
    res.json({
      ok: 0,
      data: err,
      msg: '产品保存失败'
    })
  });
});
//修改产品页面
router.get('/editeroduct/:id', function (req, res, next) {
  let classlist = ctrl.classManage.getList()
  let detail = ctrl.productManage.getList({
    rule: 'id = ' + req.params.id
  })
  Promise.all([classlist, detail]).then(r => {
    let result = r[1][0]
    result.product = r[0]
    res.render('Manage/EditProduct', result);
  })
});

router.post('/editproduct', function (req, res, next) {
  let body = req.body;
  let post = {
    id: body.id,
    data: body
  }
  ctrl.productManage.change(post).then(result => {
    res.json({
      ok: 200,
      data: result
    })
  }).catch(err => {
    console.log(err);
    res.json({
      ok: 0,
      data: err,
      msg: '产品保存失败'
    })
  });
});

//文档下载管理页面
router.get('/download', (req, res, next) => {
  res.render('Manage/Download')
})

//获取分类列表
router.get('/getClassList', function (req, res, next) {
  let param = req.query;

  let list = ctrl.classManage.getList({
    start: (param.page - 1) * param.limit,
    limit: parseInt(param.limit)
  })
  let count = ctrl.classManage.getList()

  Promise.all([list, count]).then(r => {
    res.json({
      code: 0,
      msg: '查询成功！',
      data: r[0],
      count: r[1].length
    });
  })
});

//删除分类
router.post('/deleteclass', function (req, res, next) {
  let body = req.body;
  body.id = parseInt(body.id);
  ctrl.classManage.delete(body).then(result => {
    res.json({
      ok: 200,
      data: result
    })
  }).catch(err => {
    console.log(err);
    res.json({
      ok: 0,
      data: err,
      msg: '分类删除失败'
    })
  });
});

//添加修改分类
router.post('/changeclass', function (req, res, next) {
  let body = req.body;
  let post = null
  if (!body.id) {
    post = body
  } else {
    post = {
      id: body.id,
      data: body
    }
  }
  // console.log(post);
  ctrl.classManage.change(post).then(result => {
    res.json({
      ok: 200,
      data: result
    })
  }).catch(err => {
    console.log(err);
    res.json({
      ok: 0,
      data: err,
      msg: '分类添加失败'
    })
  });
});


//获取产品列表
router.get('/getProductList', function (req, res, next) {
  let param = req.query;
  let rule = '';
  if (param.keyword) {
    if (rule == '') {
      rule += `title like '%${param.keyword}%' or entitle like '%${param.keyword}%'`
    } else {
      rule += `and (title like '%${param.keyword}%' or entitle like '%${param.keyword}%')`
    }
  }
  if (param.classid) {
    rule += `classid = ${param.classid}`
  }
  let list = ctrl.productManage.getList({
    rule,
    start: (param.page - 1) * param.limit,
    limit: parseInt(param.limit)
  })
  let count = ctrl.productManage.getList({
    rule
  })

  Promise.all([list, count]).then(r => {
    res.json({
      code: 0,
      msg: '查询成功！',
      data: r[0],
      count: r[1].length
    });
  })
});

//删除分类
router.post('/deleteproduc', function (req, res, next) {
  let body = req.body;
  body.id = parseInt(body.id);
  ctrl.productManage.delete(body).then(result => {
    res.json({
      ok: 200,
      data: result
    })
  }).catch(err => {
    console.log(err);
    res.json({
      ok: 0,
      data: err,
      msg: '产品删除失败'
    })
  });
});


//编辑详情页内容页面
router.get('/editdetail/:id', function (req, res, next) {
  ctrlWeb.getDetail({
    id: parseInt(req.params.id)
  }).then(result => {
    if (result[0].file) {
      let file = result[0].file.split('/')
      result[0].filename = file[file.length - 1]
    }
    res.render('Manage/EditDetail', result[0]);
  }).catch(err => {
    console.log(err);
    res.render('error', err);
  })
});

//编辑详情页内容页面
router.get('/editservice', function (req, res, next) {
  ctrlWeb.getService({
    id: 1
  }).then(result => {
    res.render('Manage/EditService', result[0]);
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

//修改服务支持接口
router.post('/editservice', function (req, res, next) {
  let body = req.body;
  let params = {
    one: body.onecontent,
    two: body.twocontent,
    three: body.threecontent,
    fore: body.forecontent
  }
  ctrl.updateService(params).then(result => {
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
      res.json({
        ok: 200,
        result
      })
    }
  });
})


//获取七牛上传token接口
router.get('/uptoken', function (req, res, next) {
  let querys = req.query;
  let token = '';
  if (querys.type == 'file') {
    token = downtoken.uploadToken()
  } else {
    token = uptoken.uploadToken()
  }
  res.header("Cache-Control", "max-age=0, private, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  if (token) {
    res.json({
      ok: 200,
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

//设置首页新闻接口
router.post('/setHomeNews', function (req, res, next) {
  let body = req.body;
  let params = {
    id: body.id,
    data: {
      'home': body.state
    }
  }
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