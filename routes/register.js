var express = require('express');
var router = express.Router();
var User = require('../database/user');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var appRoot = require('app-root-path');
var logger = require(`${appRoot}/utils/logger`);

router.get('/', (req, res) => {
  res.render('register', { title: 'Registration page', css: ['register.css'] });
})

router.post('/', (req, res) => {
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    if (err) {
      logger.error(err.message);
      return res.status(500).json({error: true, message: err.message});
    }
    var user = new User({
      firstName: req.body.name,
      email: req.body.email,
      userName: req.body.username,
      password: hash
    })
    user.save(function (err) {
      if (err) {
        return res.render('register', {
          title: 'Registration page',
          existingEmail: true,
          css: ['register.css']
        })
      }
      res.redirect('/register')
    })
  })
})

router.post('/api', (req, res) => {
  bcrypt.hash(req.body.user.password, 10, function (err, hash) {
    if (err) {
      logger.error(err.message);
      return res.status(500).json({error: true, message: err.message});
    }
    var user = new User({
      firstName: req.body.user.fullname,
      email: req.body.user.email,
      userName: req.body.user.username,
      password: hash,
      age: req.body.user.age
    })
    user.save()
      .then(function(user) {
        user.populate('role','name -_id', function (err,user) {
          if (err) {
            return res.json({
                   emailWrong: true,
                 })
          }
          var token = jwt.sign(user.email,'secret');
          var resObj = {
            fullname: user.firstName,
            token,
            role: user.role.name,
            id: user._id,
          }
          return res.json(resObj);

        })
      })
      .catch(err => {
        logger.error(err.message);
        return res.status(500).json({error: true, message: err.message});
      })
  })
})

module.exports = router;