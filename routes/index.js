const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const fs = require('fs')
const ctrl = require('../controllers/webpc')
const utils = require('./utils')
const lang = require('../public/i18n/lang')
let dev = true
// console.log(lang);
/* GET home page. */
router.use((req,res,next)=>{
  let client_lang = req.cookies.lang || 'zh';
  let devparam=''
  if (dev) {
    devparam = '?id=' + Math.random();
  }
  req.returnData = {lang:lang[client_lang],dev:devparam}
  next()
})
router.get('/', function (req, res, next) {
  res.render('Pc/Index', req.returnData);
});

router.get('/news/:id', function (req, res, next) {
  ctrl.getNewsDetail({
    id: parseInt(req.params.id)
  }, result => {
    console.log(result);
    res.render('Pc/NewDetail', result[0]);
  }).catch(err => {
    console.log(err);
    res.render('error', err);
  })
});

module.exports = router;