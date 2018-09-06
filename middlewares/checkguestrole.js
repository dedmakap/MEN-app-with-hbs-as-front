function checkGuestRole(req, res, next) {
    var { id } = req.params;
        if ((req.guest.role.name !== 'admin') && (req.guest._id != id)) {
            res.redirect('/')
        }
        else {
            if (req.guest.role.name === 'admin') { req.isAdmin = true; }
            next();
        }
}

module.exports = checkGuestRole;

