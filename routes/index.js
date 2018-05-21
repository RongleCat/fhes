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
router.use((req, res, next) => {
  let client_lang = req.cookies.lang || 'zh';
  let devparam = ''
  if (dev) {
    devparam = '?id=' + Math.random();
  }
  req.returnData = {
    lang: lang[client_lang],
    dev: devparam,
    client_lang
  }
  req.returnData.navActive = req.originalUrl
  if (req.originalUrl != '/') {
    req.returnData.other = true
  }
  next()
})

router.get('/', function (req, res, next) {
  let rule = ''
  let language = ''
  if (req.returnData.client_lang === 'zh') {
    language = '10'
  } else {
    language = '01'
  }
  if (language !== '11' && language !== '00' && language) {
    rule += `language like '${language.replace('0', '%')}' `
  }
  ctrl.getHomeNewsList({
    rule,
    start: 0,
    limit: 10
  }, (result) => {
    result.data.forEach(element => {
      if (element.content) {
        element.content = removeTAG(element.content).substr(0,48)+'...'
      }
      if (element.encontent) {
        element.encontent = removeTAG(element.encontent).substr(0,50)+'...'
      }
    });

    req.returnData.newsList = result.data
    res.render('Pc/Index', req.returnData);
  })
});

//新闻详情页面
router.get('/news/:id', function (req, res, next) {
  ctrl.getNewsDetail({
    id: parseInt(req.params.id)
  }, result => {
    // console.log(result);
    req.returnData.detail = result[0]
    res.render('Pc/NewDetail', req.returnData);
  }).catch(err => {
    console.log(err);
    res.render('error', err);
  })
});

//产品分类页面
router.get('/about',(req,res,next)=>{
  res.render('Pc/About', req.returnData);
})
//产品分类页面
router.get('/class',(req,res,next)=>{
  res.render('Pc/Class', req.returnData);
})
//产品分类页面
router.get('/solution',(req,res,next)=>{
  res.render('Pc/Solution', req.returnData);
})
//产品分类页面
router.get('/market',(req,res,next)=>{
  res.render('Pc/Market', req.returnData);
})
//产品分类页面
router.get('/service',(req,res,next)=>{
  res.render('Pc/Service', req.returnData);
})

function removeTAG(str) {
  return str.replace(/<[^>]+>/g, "");
}
module.exports = router;