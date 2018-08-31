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
  User.findOne({ email }, function (err, data) {
    if (err) return console.log(err);
    var { role } = data;
    if (role === 'admin') {
      return next();
    }
    return res.redirect('/');
  })
}

router.get('/', checkAdminRole, function (req, res, next) {

  var perPage = 9;
  var page = Number(req.params.page) || 1;

  User.find({})
  .skip((perPage*page) - perPage)
  .limit(perPage)
  .exec(function (err, userslist) {
    if (err) return console.log(err);
    User.count().exec(function (err, count) {
      if (err) return console.log(err);

      return res.render('users', { 
        ageRange: generateAgeRange(), 
        people: userslist, 
        current: page,
        pages: Math.ceil(count/perPage),
        size: 5,
        title: 'Users list page', 
        css: ['bootstrap.min.css', 'users.css'] 
      })
    })
  })
});

module.exports = router;
