var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../database/user');

function searchByName(req,res) {
    var searchKey = new RegExp(req.query.q.trim(), 'i');
    User.find({ firstName: searchKey }, function (err, userslist) {
      return res.render('partials/userstable',{layout:false, people: userslist, title: 'Users list page', css: ['bootstrap.min.css', 'users.css'] })
    })
  }
  
  function searchByAge(req,res) {
    var start = +req.query.start;
    var end = +req.query.end;
    console.log(typeof start,typeof end);
    if (end < start) {
      var buf = end;
      end = start;
      start = buf;
    }
    User.find({age: {$gte : start, $lte : end}}, function (err, userslist) {
      console.log(start,end);
      return res.render('partials/userstable', {layout:false, people: userslist, title: 'Users list page', css: ['bootstrap.min.css', 'users.css']})
    })
  }

//router.get('/', searchByName(req,res))

router.get('/', function (req, res, next) {
    searchByName(req,res)  
})

router.get('/age', function (req, res, next) {
    searchByAge(req,res)  
})

  
  module.exports = router;