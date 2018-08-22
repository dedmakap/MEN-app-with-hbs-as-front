var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

function middle(req, res, next) {
  

  next();
}

/* GET users listing. */
router.get('/', middle, function(req, res, next) {
  res.send(req.boi);
});

module.exports = router;
