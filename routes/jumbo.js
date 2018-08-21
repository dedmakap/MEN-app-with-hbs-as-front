var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

//GET sign in page.

router.get('/', (req, res) => {
    if (req.cookies.token) {
        var token = req.cookies.token;
        var user = jwt.verify(token, 'secret');
    }
    res.render('jumbo',{ user: user, title: 'MyApp', css: ['jumbo.css'] });
})

module.exports = router;