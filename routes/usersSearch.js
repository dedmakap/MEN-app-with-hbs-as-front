var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../database/user');

function searchByName(req, res) {
  var searchKey = new RegExp(req.query.q.trim(), 'i');
  User.find({ firstName: searchKey }, function (err, userslist) {
    return res.render('partials/userstable', { layout: false, people: userslist, title: 'Users list page', css: ['bootstrap.min.css', 'users.css'] })
  })
}

function searchByAge(req, res) {
  var start = +req.query.start;
  var end = +req.query.end;
  console.log(typeof start, typeof end);
  if (end < start) {
    var buf = end;
    end = start;
    start = buf;
  }
  User.find({ age: { $gte: start, $lte: end } }, function (err, userslist) {
    console.log(start, end);
    return res.render('partials/userstable', { layout: false, people: userslist, title: 'Users list page', css: ['bootstrap.min.css', 'users.css'] })
  })
}

function search(req, res) {
  var nameKey, ageKey, startAge, endAge; 
  var query = {};
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
    startAge = +req.query.start;
    endAge = +req.query.end;
    if (endAge < startAge) {
      var buf = endAge;
      endAge = startAge;
      startAge = buf;
    }
  }

  if (nameKey) {
    query.firstName = nameKey
  }
  if (ageKey) {
    query.age = { $gte: startAge, $lte: endAge}
  }
  User.find(query, function (err, userslist) {
    return res.render('partials/userstable', { layout: false, people: userslist, title: 'Users list page', css: ['bootstrap.min.css', 'users.css'] })
  })

}


router.get('/', function (req, res, next) {
  search(req, res)
})

// router.get('/age', function (req, res, next) {
//   searchByAge(req, res)
// })
/*
todos:
- pagination
- one route for all queries
- be able to use only one age dropdown | done
- add sorting @@
*/



module.exports = router;