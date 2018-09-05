var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../database/user');


function search(req, res) {
  var nameKey, ageKey, startAge, endAge;
  var myQuery = {};
  var perPage = 9;
  var page = Number(req.query.page) || 1;

  if (!req.query.q) {
    nameKey = false
  }
  else {
    nameKey = new RegExp(req.query.q.trim(), 'i');
  }
  if ((!req.query.start) || (!req.query.end)) {
    ageKey = false
  }
  else {
    ageKey = true
    startAge = +req.query.start;
    endAge = +req.query.end;
    if (endAge < startAge) {
      var buf = endAge;
      endAge = startAge;
      startAge = buf;
    }
  }

  if (nameKey) {
    myQuery.firstName = nameKey
  }
  if (ageKey) {
    myQuery.age = { $gte: startAge, $lte: endAge }
  }

  let users = null;
  User.find(myQuery)
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .populate('role', 'name -_id')
    .then(function (userslist) {
      users = userslist;
      return User.count(myQuery)
    })
    .then(function (count) {
      return res.render('partials/userstable', {
        layout: false,
        people: users,
        current: page,
        pages: Math.ceil(count / perPage),
        size: 5,
        title: 'Users list page',
        css: ['bootstrap.min.css', 'users.css']
      })
    })
    .catch((err) => {
      console.log(err);
    })

}


router.get('/', function (req, res, next) {
  search(req, res)
})


module.exports = router;