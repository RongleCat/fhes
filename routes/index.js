const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const fs = require('fs')
const ctrl = require('../controllers/webpc')

const utils = require('./utils')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('Pc/Index', {
    title: 'Express'
  });
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