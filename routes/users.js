var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../database/user');

function generateAgeRange() {
  var ageFrom = 10;
  var ageTo = 70;
  var ageRange = [];
  for (let i = 0; i <= ageTo-10; i++) {
    ageRange[i] = ageFrom
    ageFrom++
  }
  return ageRange;
}

function checkAdminRole(req, res, next) {
  if (!req.cookies.token) {
    res.redirect('/');
  }
  var email = jwt.verify(req.cookies.token, 'secret');
  User.findOne({ email: email }, function (err, data) {
    if (err) return console.log(err);
    var { role } = data;
    if (role === 'admin') {
      return next();
    }
    return res.redirect('/');
  })
}

router.get('/', checkAdminRole, function (req, res, next) {
  User.find({}, function (err, userslist) {
    return res.render('users', { ageRange: generateAgeRange(), people: userslist, title: 'Users list page', css: ['bootstrap.min.css', 'users.css'] })
  })
});

module.exports = router;
