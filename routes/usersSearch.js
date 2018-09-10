var express = require('express');
var router = express.Router();
var User = require('../database/user');
var ajaxAuth = require('../middlewares/ajaxauth');


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
    .sort({[req.query.target]: req.query.direction})
    .then(function (userslist) {
      users = userslist;
      return User.count(myQuery)
    })
    .then(function (count) {
      return res.render('partials/userstable', {
        layout: false,
        people: users,
        current: page,
        direction: req.query.direction,
        target: req.query.target,
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


router.get('/',ajaxAuth, function (req, res, next) {
 return search(req, res)
})


module.exports = router;