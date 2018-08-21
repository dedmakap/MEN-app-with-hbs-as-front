var express = require('express');
var router = express.Router();
var User = require('../database/user') 

//GET register page.
router.get('/', (req, res) => {
    res.render('register',{ title: 'Registration page', css: ['register.css']});
})

router.post('/', (req, res) => {
    console.log(req.body);
    // if (User.find({email: req.body.email })) {
    //     console.log('already exists!');
    //     return res.redirect('/register')
    // }
    
    var user = new User({
        firstName : req.body.name,
        email : req.body.email,
        userName : req.body.username,
        password : req.body.password
    })
    user.save((err) => {
        if (err) {
            return res.render('register', {title: 'Registration page', existingEmail: true, css: ['register.css']})
        }
        console.log('obj saved', user);
        res.redirect('/register')
    })
})

module.exports = router;