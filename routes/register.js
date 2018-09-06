var express = require('express');
var router = express.Router();
var User = require('../database/user');
var bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('register', { title: 'Registration page', css: ['register.css'] });
})

router.post('/', (req, res) => {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) { console.log(err); }
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

module.exports = router;