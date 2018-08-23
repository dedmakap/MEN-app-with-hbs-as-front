var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../database/user');

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

/* GET users listing. */
router.get('/', checkAdminRole, function (req, res, next) {
  User.find({}, function (err, userslist) {
    res.render('users', { people: userslist, title: 'Users list page', css: ['bootstrap.min.css'] })
  })

});

module.exports = router;
