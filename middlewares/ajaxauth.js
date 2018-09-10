var User = require('../database/user');
var jwt = require('jsonwebtoken');

function checkAuthForAJAX(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    jwt.verify(req.headers.authorization, 'secret', function (err, decoded) {
        if (err) return res.status(401).send('Unauthorized request');
        User.findOne({ email: decoded })
        .populate('role', 'name')
        .exec( function (err, guest) {
            if (err) return res.redirect('/');
            if (!guest) return res.status(401).send('Unauthorized request');
            req.guest = guest;
            return next();
        }) 
    });
    
    
}

module.exports = checkAuthForAJAX;