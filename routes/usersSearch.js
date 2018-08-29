var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../database/user');


function search(req, res) {
  var nameKey, ageKey, startAge, endAge; 
  var myQuery = {};
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
    myQuery.age = { $gte: startAge, $lte: endAge}
  }
  console.log(myQuery);
  User.find(myQuery, function (err, userslist) {
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
- one route for all queries | done
- be able to use only one age dropdown | done
- add sorting @@
*/



module.exports = router;