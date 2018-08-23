var express = require('express');
var router = express.Router();
var User = require('../database/user');
var jwt = require('jsonwebtoken');


router.get('/:id', function(req, res, next) {
  var token = req.cookies.token;
  if (!token) {
    res.redirect('/')
  }
  var id = req.params['id'];
  var email = jwt.verify(token, 'secret'); 
  User.findOne({ email: email }, function (err, guest) {
    if (err) throw err
    if ((guest.role !== 'admin') && (guest._id != id)) {
      console.log(typeof guest._id, typeof id);
      res.redirect('/')
    }  
    else {
      User.findOne({_id: id}, function(err,owner) {
        res.render('userpage', { 
          firstname: owner.firstName, 
          email: owner.email,
          username: owner.userName,
          role: owner.role,
          css:['userpage.css']});
      })
    }

    
  });
  
});

module.exports = router;
