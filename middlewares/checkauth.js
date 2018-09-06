var User = require('../database/user');
var jwt = require('jsonwebtoken');

function checkAuthentication(req, res, next) {
    if (!req.cookies.token) {
        res.redirect('/');
    }
    var email = jwt.verify(req.cookies.token, 'secret');
    User.findOne({ email })
        .populate('role', 'name')
        .exec( function (err, guest) {
            if (err) return res.redirect('/');
            req.guest = guest;
            next();
        }) 
}

module.exports = checkAuthentication;