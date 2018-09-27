var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../database/user');
var appRoot = require('app-root-path');
var logger = require(`${appRoot}/utils/logger`);

router.get('/', (req, res) => {
    if (!req.cookies.token) {
        return res.render('jumbo', { title: 'MyApp', css: ['jumbo.css'] });
    }
    var { token } = req.cookies;
    var email = jwt.verify(token, 'secret');
    var user;
    var isAdmin = false;
    User.findOne({ email })
        .populate('role', 'name')
        .exec(function (err, data) {
            if (err) {
                logger.error(err.message);
                return res.status(500).json({error: true, message: err.message});
              }
            if (!data) {
                return res.render('jumbo', {
                    title: 'MyApp',
                    css: ['jumbo.css']
                });
            }
            user = data.firstName;
            if (data.role.name === 'admin') {
            isAdmin = true;
            }
                return res.render('jumbo', {
                id: data._id,
                user,
                isAdmin,
                title: 'MyApp',
                css: ['jumbo.css']
                });
        })
})

module.exports = router;