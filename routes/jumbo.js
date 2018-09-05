var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../database/user') 

router.get('/', (req, res) => {
    if (req.cookies.token) {
        var { token } = req.cookies;
        var email = jwt.verify(token, 'secret'); 
        var user;
        var isAdmin = false;
        User.findOne({ email }) 
            .populate('role', 'name')
            .exec(function (err, data) {
                if (err) return console.log(err);
                if (data) {
                   user = data.firstName;
                    if (data.role.name === 'admin') {
                        isAdmin = true;
                    }
                    res.render('jumbo',{ id: data._id ,user: user, isAdmin: isAdmin, title: 'MyApp', css: ['jumbo.css'] });
                }
                else res.render('jumbo',{ title: 'MyApp', css: ['jumbo.css'] });
        })
    }
    else
    res.render('jumbo',{ title: 'MyApp', css: ['jumbo.css'] });
    
})

module.exports = router;