var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../database/user');

function middle(req, res, next) {
  if (!req.cookies.token) {
    res.redirect('/');
  }
  var email = jwt.verify(req.cookies.token, 'secret'); 
  User.findOne({ email: email }, function (err, data) {
    if (err) return console.log(err);
    var role = data.role;
    if (role === 'admin') {
      next();
    }
    else {
      res.redirect('/');
    }
})
}

/* GET users listing. */
router.get('/', middle, function(req, res, next) {
  res.send('boi');
});

module.exports = router;
