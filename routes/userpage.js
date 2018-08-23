var express = require('express');
var router = express.Router();
var User = require('../database/user');
var jwt = require('jsonwebtoken');

function checkGuestRole(req, res, next) {
  if (!req.cookies.token) {
    res.redirect('/');
  }
  var id = req.params['id'];
  var email = jwt.verify(req.cookies.token, 'secret');
  User.findOne({ email: email }, function (err, guest) {
    if (err) throw err
    if ((guest.role !== 'admin') && (guest._id != id)) {
      console.log(typeof guest._id, typeof id);
      res.redirect('/')
    }
    else next();
  })
}

router.get('/:id', checkGuestRole, function (req, res, next) {
  var id = req.params['id'];
  User.findOne({ _id: id }, function (err, owner) {
    res.render('userpage', {
      title: "User's profile page",
      firstname: owner.firstName,
      email: owner.email,
      username: owner.userName,
      role: owner.role,
      css: ['userpage.css']
    });
  })

});

module.exports = router;
