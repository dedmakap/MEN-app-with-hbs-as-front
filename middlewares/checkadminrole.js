function checkAdminRole(req, res, next) {
        if (req.guest.role.name === 'admin') {
                return next();
            }
            return res.redirect('/');
       
}

module.exports = checkAdminRole;