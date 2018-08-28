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



// router.get('/search/', function (req, res, next) {
//   var searchKey = new RegExp(req.query.q.trim(), 'i');
//   User.find({ firstName: searchKey }, function (err, userslist) {
//     return res.send({ageRange: generateAgeRange(), people: userslist, title: 'Users list page', css: ['bootstrap.min.css', 'users.css'] })
//   })

// })

// router.get('/search/age', function (req, res, next) {
//   var start = +req.query.start;
//   var end = +req.query.end;
//   console.log(typeof start,typeof end);
//   if (end < start) {
//     var buf = end;
//     end = start;
//     start = buf;
//   }
//   User.find({age: {$gte : start, $lte : end}}, function (err, userslist) {
//     console.log(start,end);
//     return res.render('userstable', {ageRange: generateAgeRange(), people: userslist, title: 'Users list page', css: ['bootstrap.min.css', 'users.css']})
//   })
// })

router.get('/', checkAdminRole, function (req, res, next) {
  User.find({}, function (err, userslist) {
    return res.render('users', { ageRange: generateAgeRange(), people: userslist, title: 'Users list page', css: ['bootstrap.min.css', 'users.css'] })
  })
});

module.exports = router;
