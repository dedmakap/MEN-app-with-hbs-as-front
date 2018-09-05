var express = require('express');
var router = express.Router();
var User = require('../database/user');
var jwt = require('jsonwebtoken');
var multer = require('multer');
var path = require("path");
var fs = require("fs");
var Role = require('../database/role');

var upload = multer({ dest: './public/images' });


function checkGuestRole(req, res, next) {
    if (!req.cookies.token) {
        res.redirect('/');
    }
    var { id } = req.params;
    var email = jwt.verify(req.cookies.token, 'secret');
    User.findOne({ email })
        .populate('role', 'name')
        .exec(function (err, guest) {
        if (err) return console.log(err);
        if ((guest.role.name !== 'admin') && (guest._id != id)) {
            res.redirect('/')
        }
        else {
            if (guest.role.name === 'admin') { req.isAdmin = true; }

            next();
        }
    })
}

router.get('/:id', checkGuestRole, function (req, res, next) {
    var { id } = req.params;
    var avaPath = path.join(__dirname, "../public/images/");
    var avaFile
    User.findOne({ _id: id })
        .populate('role', 'name -_id')
        .exec(function (err, owner) {
        if (err) return console.log(err);
        if (fs.existsSync(avaPath + owner.avatar)) {
            avaFile = owner.avatar;
        }
        else {
            avaFile = '';
        }
        res.render('userpage', {
            title: "User's profile page",
            firstname: owner.firstName,
            email: owner.email,
            username: owner.userName,
            role: owner.role.name,
            id: owner._id,
            avatar: avaFile,
            admin: req.isAdmin,
            css: ['userpage.css']
        });
    })

});

router.post('/:id', upload.single('file'), function (req, res, next) {
    if (!req.file) res.redirect('/users/userpage/' + req.params.id);
    User.findOneAndUpdate({ _id: req.params.id }, {avatar :req.file.filename }, function (err, data) {
        if (err) return console.log(err);
        res.redirect('/users/userpage/' + req.params.id);
    })
})

router.put('/:id', function (req, res) {
    if (req.body.roleId) {
        return Role.findOne({_id : req.body.roleId}, function (err, data) {
            if (err) {console.log(err);}
            if (!data) return res.end()
            User.findOneAndUpdate({_id: req.params['id']}, {role: data._id}, function (err) {
                if (err) return console.log(err);
                return res.json({
                    name: data.name
                });
                //return res.end();
                
            })
        })
    }
    if (!req.body.key) return res.end()
    var key;
    switch (req.body.key) {
        case 'firstname-tab':
            key = 'firstName'
            break;
        case 'email-tab':
            key = 'email'
            break;
        case 'username-tab':
            key = 'userName'
            break;
        default:
            break;
    }
    var data = req.body.data;
    User.findOneAndUpdate({ _id: req.params['id'] }, { [key]: data }, function (err, user) {
        if (err) console.log(err);
        return res.end();
    })
})


module.exports = router;
