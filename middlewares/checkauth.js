var User = require('../database/user');
var jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
  if (!req.cookies.token) {
    return res.redirect('/');
  }
  var email = jwt.verify(req.cookies.token, 'secret');
  User.findOne({ email })
    .populate('role', 'name')
    .exec(function (err, guest) {
      if (err) return res.redirect('/');
      req.guest = guest;
      return next();
    })
}

function checkAuthReact(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  var bearerToken = req.headers.authorization.split(' ');
  var token = bearerToken[1];
  var email = jwt.verify(token, 'secret');
  User.findOne({ email })
    .populate('role', 'name -_id')
    .then(function (guest) {
      req.guest = guest;
      return next();
    })
}

function checkAdminRoleReact(req, res, next) {
  if (req.guest.role.name === 'admin' || req.guest._id == req.params.id) {
    return next();
  }
  return res.status(403).end();
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
  checkAuthReact,
  checkAdminRoleReact,
};