const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const fs = require('fs')
const ctrl = require('../controllers/manage')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Pc/Index', { title: 'Express' });
});

module.exports = router;
