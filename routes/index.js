const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  res.send('欢迎来到主页!');
});

module.exports = router;