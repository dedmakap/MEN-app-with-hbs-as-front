var express = require('express');
var router = express.Router();
var User = require('../database/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var appRoot = require('app-root-path');
var logger = require(`${appRoot}/utils/logger`);
var db = require('../models/index');

 


router.get('/', (req, res) => {
  res.render('sign-in', { title: 'Log in page', css: ['style.css'] });
})

router.post('/', (req, res) => {
  var { email } = req.body;
  var pass = req.body.password;
  User.findOne({ email }, function (err, user) {
    if (err) {
      logger.error(err.message);
      return res.status(500).json({ error: true, message: err.message });
    }

    if (!user) {
      return res.render('sign-in', {
        title: 'Log in page',
        css: ['style.css'],
        noSuchEmail: true
      })
    }

    bcrypt.compare(pass, user.password, function (err, confirm) {
      if (err) {
        logger.error(err.message);
        return res.status(500).json({ error: true, message: err.message });
      }
      if (confirm) {
        // Passwords match
        var token = jwt.sign(user.email, 'secret');
        res.cookie('token', token);
        return res.redirect('/')
      } else {
        // Passwords don't match
        return res.render('sign-in', {
          title: 'Log in page',
          css: ['style.css'],
          wrongPassword: true
        })
      }
    });
  });

})

router.post('/api', (req, res) => {

  if (Object.keys(req.body.guest).length > 2) {
    var { email } = req.body.guest;
    db.User.findOne({
      where: { email },
      include: ['Role']
    })
      .then(user => {
        var token = jwt.sign(user.email, 'secret');
        var resObj = {
          fullname: user.fullname,
          token,
          role: user.Role.title,
          id: user.id,
        }
        console.log(user);

        return res.json(resObj);
      })
    // User.findOne({ email })
    //   .populate('role', 'name -_id')
    //   .then(function (user) {
    //     if (!user) {
    //       var newUser = new User({
    //         firstName: req.body.guest.firstName,
    //         email: req.body.guest.email,
    //         age: req.body.guest.age,
    //       })
    //       newUser.save()
    //         .then(function(user) {
    //           user.populate('role','name -_id', function (err,user) {
    //             if (err) {
    //               return res.json({
    //                 emailWrong: true,
    //               })
    //             }
    //             var token = jwt.sign(user.email, 'secret');
    //             var resObj = {
    //               fullname: user.firstName,
    //               token,
    //               role: user.role.name,
    //               id: user._id,
    //             }
    //             return res.json(resObj);
    //           })
    //         })
    //     }
    //     var token = jwt.sign(user.email, 'secret');
    //     return res.json({
    //       fullname: user.firstName,
    //       token,
    //       role: user.role.name,
    //       id: user._id,
    //     })
    //   })

  }
  else {
    var { email } = req.body.guest;
    var { password } = req.body.guest;
    db.User.findOne({
      where: { email },
      include: [
        'Role'
      ]
    })
      .then(user => {
        if (!user) {
          return res.json({ emailWrong: true })
        }
        bcrypt.compare(password, user.password, (err, confirm) => {
          if (err) {
            logger.error(err.message);
            return res.status(500).json({ error: true, message: err.message });
          }
          if (confirm) {
            // Passwords match
            var token = jwt.sign(user.email, 'secret');
            var resObj = {
              fullname: user.fullname,
              token,
              role: user.Role.title,
              id: user.id,
            }
            return res.json(resObj);

          } else {
            // Passwords don't match
            return res.json({
              passWrong: true,
            })
          }
        });

      })
      // User.findOne({ email })
      //   .populate('role', 'name -_id')
      //   .then(function (user) {
      //     if (!user) {
      //       return res.json({ emailWrong: true })
      //     }

      //     bcrypt.compare(password, user.password, function (err, confirm) {
      //       if (err) {
      //         logger.error(err.message);
      //         return res.status(500).json({ error: true, message: err.message });
      //       }
      //       if (confirm) {
      //         // Passwords match
      //         var token = jwt.sign(user.email, 'secret');
      //         return res.json({
      //           fullname: user.firstName,
      //           token,
      //           role: user.role.name,
      //           id: user._id,
      //         })
      //       } else {
      //         // Passwords don't match
      //         return res.json({
      //           passWrong: true,
      //         })
      //       }
      //     });
      //   })
      .catch(function (err) {
        logger.error(err.message);
        return res.status(500).json({ error: true, message: err.message });
      })
  }
})


module.exports = router;