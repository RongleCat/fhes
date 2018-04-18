const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const fs = require('fs')
const ctrl = require('../controllers/manage')

/* GET home page. */
router.get('/', function (req, res, next) {
  verifyToken(req, res, function (r) {
    res.render('Manage/Index',r.data);
  })
});

router.get('/login', function (req, res, next) {
  verifyToken(req, res, function (r) {
    if (r.ok === 200) {
      res.redirect(302, '/manage');
    } else {
      res.render('Manage/Login')
    }
  },true)
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
    callback(r)
  }).catch(r=>{
    res.redirect(302, '/manage/login')
  })
}

module.exports = router;