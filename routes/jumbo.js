var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../database/user') 

//GET sign in page.

router.get('/', (req, res) => {
    if (req.cookies.token) {
        var token = req.cookies.token;
        var email = jwt.verify(token, 'secret'); 
        var user;
        User.findOne({ email: email }, function (err, data) {
            if (err) return console.log(err);
            console.log(data.firstName);
            user = data.firstName;
            res.render('jumbo',{ user: user, title: 'MyApp', css: ['jumbo.css'] });
        })
    }
    
    res.render('jumbo',{ user: user, title: 'MyApp', css: ['jumbo.css'] });
})

module.exports = router;