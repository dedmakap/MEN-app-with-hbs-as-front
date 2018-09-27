var express = require('express');
var router = express.Router();
var User = require('../database/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');



router.get('/', (req, res) => {
    res.render('sign-in', { title: 'Log in page', css: ['style.css'] });
})

router.post('/', (req, res) => {
    var { email } = req.body;
    var pass = req.body.password;
    User.findOne({ email }, function (err, user) {
        if (err) return console.log(err);

        if (!user) {
            return res.render('sign-in', {
                title: 'Log in page',
                css: ['style.css'],
                noSuchEmail: true
            })
        }

        bcrypt.compare(pass, user.password, function (err, confirm) {
            if (err) { return console.log(err); }
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

router.post('/api', (req, res)=>{
    console.log(req.body)
    var {email} = req.body.guest;
    var {password} = req.body.guest;
    User.findOne({ email })
    .populate('role','name -_id')
    .then(function (user) {
        if (!user) {
            return res.json({emailWrong: true})
        }

        bcrypt.compare(password, user.password, function (err, confirm) {
            if (err) { return console.log(err); }
            if (confirm) {
                // Passwords match
                var token = jwt.sign(user.email, 'secret');
                return res.json({
                    fullname: user.firstName,
                    token,
                    role: user.role.name,
                    id: user._id,
                })
            } else {
                // Passwords don't match
                return res.json({
                    passWrong: true,
                })
            }
        });
    })
    .catch(function (err) {
        return console.log(err);
    })
})


module.exports = router;