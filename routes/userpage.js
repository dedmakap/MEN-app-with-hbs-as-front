var express = require('express');
var router = express.Router();
var User = require('../database/user');
var jwt = require('jsonwebtoken');
var multer = require('multer');
var path = require("path");
var fs = require("fs");

var upload = multer({ dest: './public/images' });


function checkGuestRole(req, res, next) {
  if (!req.cookies.token) {
    res.redirect('/');
  }
  var  { id } = req.params;
  var email = jwt.verify(req.cookies.token, 'secret');
  User.findOne({ email }, function (err, guest) {
    if (err) return console.log(err); 
    if ((guest.role !== 'admin') && (guest._id != id)) {
      res.redirect('/')
    }
    else {
      if (guest.role === 'admin') {req.isAdmin = true;}
      
      next();
    }  
  })
}

router.get('/:id', checkGuestRole, function (req, res, next) {
  var { id } = req.params;
  var avaPath = path.join(__dirname, "../public/images/");
  var avaFile
  User.findOne({ _id: id }, function (err, owner) {
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
      role: owner.role,
      id: owner._id,
      avatar: avaFile,
      admin: req.isAdmin,
      css: ['userpage.css']
    });
  })

});

router.post('/:id', upload.single('file'), function (req, res, next) {
  if (!req.file) res.redirect('/users/userpage/' + req.params.id);
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, "../public/images/");
  User.findOne({ _id: req.params.id }, function (err, data) {
    if (err) return console.log(err); 
    data.avatar = req.file.filename;
    data.save();
    res.redirect('/users/userpage/' + req.params.id);
  })
})

router.put('/:id', function (req, res) {
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
    case 'role-tab':
      key = 'role'
      break;
    default:
      break;
  }
  var data = req.body.data;
  User.findOneAndUpdate({ _id: req.params['id'] }, { [key]: data }, function (err, user) {
    if (err) console.log(err); 
    res.end();
  })
})


module.exports = router;
