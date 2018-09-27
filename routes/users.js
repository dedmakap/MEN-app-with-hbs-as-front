var express = require('express');
var router = express.Router();
var User = require('../database/user');
var { checkAdminRole, 
      checkAuth, 
      checkAuthReact, 
      checkAdminRoleReact,
} = require('../middlewares/checkauth')
var Role = require('../database/role');
var {logger} = require('../utils/logger');


function generateAgeRange() {
  var ageFrom = 10;
  var ageTo = 70;
  var ageRange = [];
  for (let i = 0; i <= ageTo - 10; i++) {
    ageRange[i] = ageFrom
    ageFrom++
  }
  return ageRange;
}


router.get('/', checkAuth, checkAdminRole, function (req, res, next) {

  var perPage = 9;
  var page = Number(req.params.page) || 1;

  User.find({})
    .populate('role', 'name -_id')
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function (err, userslist) {
      if (err) return console.log(err);
      User.count().exec(function (err, count) {
        if (err) return console.log(err);

        return res.render('users', {
          ageRange: generateAgeRange(),
          people: userslist,
          current: page,
          pages: Math.ceil(count / perPage),
          size: 5,
          title: 'Users list page',
          css: ['bootstrap.min.css', 'users.css']
        })
      })
    })
});

async function search(query) {
  var formattedQuery = {};
  var perPage = 9; //todo choose perpage
  var page = Number(query.page) || 1;
  var nameKey = new RegExp(query.name.trim(), 'i');
  formattedQuery.firstName = nameKey;
  formattedQuery.age = { $gte: query.age.min, $lte: query.age.max };
  //var users=null no needed because of async await 
  var result = {};
    const users = await User.find(formattedQuery)
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .sort({[query.sortTarget]: query.sortDirection})
      .populate('role', 'name -_id');
  
    const count = await User.count(formattedQuery);
    result.users = users;
    result.current = page;
    result.pages = Math.ceil(count / perPage);
    return result;
  

}

async function searchOne(id) {
  var query = {'_id' : id};
  try {
    var user = await User.findOne(query)
      .populate('role', 'name -_id');
    return user;
  } catch (err) {
    console.log(err)
  }

}

router.get(
  '/api/:id',checkAuthReact, 
  checkAdminRoleReact, 
  async function (req, res, next) {
    var id = req.params.id;
    try {
      const searchResult = await searchOne(id);
      return res.json(searchResult);
    } catch (err) {
    console.log(err);
    }
  }
)

router.put(
  '/api/:id', 
  checkAuthReact, 
  checkAdminRoleReact, 
  async function (req, res, next) {
    var fieldId = req.body.colId;
    var userId = req.params.id;
    var newValue = req.body.updateValue
    if (fieldId === 'role') {
      console.log(fieldId, userId, newValue)
      return Role.findOne({_id: newValue})
        .then((role) => {
          User.findOneAndUpdate(
            {_id: userId}, 
            {role: role._id},
            {new: true}
            )
          .populate('role', 'name -_id')
          .exec(
            function (err, user) {
              if (err) console.log(err);
              return res.json(user.toResponse());
            })
        })
       return res.end();

    }
    User.findOneAndUpdate(
      {_id: userId}, 
      {[fieldId]: newValue},
      {new: true},
      )
      .populate('role', 'name -_id')
      .exec(
      function (err, user) {
        if (err) console.log(err);
        return res.json(user.toResponse());
      })
    
    
  
})

router.get(
  '/api',
  checkAuthReact, 
  checkAdminRoleReact, 
  async function (req, res, next) {
    console.log(logger)
    var query = req.query;
    try {
      query.age = JSON.parse(req.query.age);
      const searchResult = await search(query);
      return res.json(searchResult);
    } catch (err) {
      console.log(err); //todo Make error object and send it to front
    }  
  }
)

module.exports = router;
