var express = require('express');
var router = express.Router();
var User = require('../database/user');
var {checkAdminRole} = require('../middlewares/checkauth')
var {checkAuth} = require('../middlewares/checkauth');

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


router.get('/',checkAuth, checkAdminRole, function (req, res, next) {

    var perPage = 9;
    var page = Number(req.params.page) || 1;

    User.find({})
        .populate('role','name -_id')
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

module.exports = router;
