var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('hlo')
  res.send(process.env.FRONTEND_URL);
});

module.exports = router;
