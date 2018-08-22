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
        var isAdmin = false;
        User.findOne({ email: email }, function (err, data) {
            if (err) return console.log(err);
            user = data.firstName;
            if (data.role === 'admin') isAdmin = true;
            res.render('jumbo',{ user: user, isAdmin: isAdmin, title: 'MyApp', css: ['jumbo.css'] });
        })
    }
    else
    res.render('jumbo',{ title: 'MyApp', css: ['jumbo.css'] });
    
})

module.exports = router;