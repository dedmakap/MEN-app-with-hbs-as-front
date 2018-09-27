var User = require('../database/user');
var jwt = require('jsonwebtoken');

function checkAuthForAJAX(req, res, next) {
    if (!req.query.headers['Authorization']) {
        return res.status(401).send('Unauthorized request')
    }
    jwt.verify(req.query.headers['Authorization'], 'secret', function (err, decoded) {
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