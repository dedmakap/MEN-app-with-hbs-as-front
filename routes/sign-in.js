var express = require('express');
var router = express.Router();
var User = require('../database/user');
var jwt = require('jsonwebtoken');


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
        if (user.password === pass) {
            var token = jwt.sign(user.email, 'secret');
            console.log(user.email);
            res.cookie('token', token);
            return res.redirect('/')
        }

        return res.render('sign-in', {
            title: 'Log in page',
            css: ['style.css'],
            wrongPassword: true
        })
    });

})
module.exports = router;