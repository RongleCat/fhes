const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const fs = require('fs')
const ctrl = require('../controllers/manage')

//检测是否含有非法字符
router.use(function (req, res, next) {
  if (JSON.stringify(req.body) != '{}') {
    let r = [];
    for (var i in req.body) {
      if (/[@#\$<>%\^&\*]+/g.test(req.body[i])) {
        res.json({
          ok: 0,
          msg: '您提交的内容含有非法字符！'
        })
        return false;
      }
    }
    next();
  } else {
    next();
  }
});

/* GET home page. */
router.get('/', function (req, res, next) {
  verifyToken(req, res, function (r) {
    res.render('Manage/Main', r.data);
  })
});

router.get('/index', function (req, res, next) {
  verifyToken(req, res, function (r) {
    res.render('Manage/Index', r.data);
  })
});

router.get('/article', function (req, res, next) {
  verifyToken(req, res, function (r) {
    res.render('Manage/Article', r.data);
  })
});

router.get('/getArticleList', function (req, res, next) {
  let param = req.query;
  ctrl.getArticleList({
    rule: {},
    start: (param.page - 1) * param.limit,
    limit: parseInt(param.limit)
  }, (result) => {
    result.code = 0;
    result.msg = '查询成功！'
    res.json(result);
  })
});

router.get('/login', function (req, res, next) {
  verifyToken(req, res, function (r) {
    if (r.ok === 200) {
      res.redirect(302, '/manage');
    } else {
      res.render('Manage/Login')
    }
  }, true)
});

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
// router.get('/login', function(req, res, next) {
//   res.render('Manage/Login');
// });

function createToken(res, data) {
  let cert = fs.readFileSync('cert/private.key')
  let token = jwt.sign(data, cert, {
    algorithm: 'RS256',
    expiresIn: '30m'
  })
  res.cookie('Authorization', token)
  return token
}

function verifyToken(req, res, callback, type) {
  var token = req.cookies.Authorization
  var cert = fs.readFileSync('cert/public.key')
  return new Promise((rok, rno) => {
    jwt.verify(token, cert, function (err, decoded) {
      if (err) {
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
        rok({
          ok: 200,
          data: decoded
        })
      }
    })
  }).then(r => {
    if (callback) {
      callback(r)
    }
  }).catch(r => {
    res.redirect(302, '/manage/login')
  })
}

module.exports = router;