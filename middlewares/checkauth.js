var User = require('../database/user');
var jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    if (!req.cookies.token) {
        return res.redirect('/');
    }
    var email = jwt.verify(req.cookies.token, 'secret');
    User.findOne({ email })
        .populate('role', 'name')
        .exec( function (err, guest) {
            if (err) return res.redirect('/');
            req.guest = guest;
            return next();
        }) 
}

function checkAdminRole(req, res, next) {
    if (req.guest.role.name === 'admin') {
        return next();
    }
    return res.redirect('/');

}

function checkGuestRole(req, res, next) {
    var { id } = req.params;
        if ((req.guest.role.name !== 'admin') && (req.guest._id != id)) {
            res.redirect('/')
        }
        else {
            if (req.guest.role.name === 'admin') { req.isAdmin = true; }
            next();
        }
}

module.exports = {
    checkAuth,
    checkGuestRole,
    checkAdminRole,
};