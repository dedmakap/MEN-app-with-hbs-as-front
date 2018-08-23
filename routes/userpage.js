var express = require('express');
var router = express.Router();
var User = require('../database/user');
var jwt = require('jsonwebtoken');
var multer = require('multer');
var path = require("path");
var fs = require("fs");

var upload = multer({dest: './public/images'});

function checkGuestRole(req, res, next) {
  if (!req.cookies.token) {
    res.redirect('/');
  }
  var id = req.params['id'];
  var email = jwt.verify(req.cookies.token, 'secret');
  User.findOne({ email: email }, function (err, guest) {
    if (err) throw err
    if ((guest.role !== 'admin') && (guest._id != id)) {
      res.redirect('/')
    }
    else next();
  })
}

router.get('/:id', checkGuestRole, function (req, res, next) {
  var id = req.params['id'];
  User.findOne({ _id: id }, function (err, owner) {
    res.render('userpage', {
      title: "User's profile page",
      firstname: owner.firstName,
      email: owner.email,
      username: owner.userName,
      role: owner.role,
      id: owner._id,
      css: ['userpage.css']
    });
  })

});

router.post('/:id',  upload.single('file'), function (req, res, next) {
  //console.log(req);
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, "../public/images/" + req.params['id'] +".png");

  if (path.extname(req.file.originalname).toLowerCase() === ".png") {
    fs.rename(tempPath, targetPath, err => {
      if (err) throw (err)

      res.redirect('/users/'+req.params['id']);
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) throw (err);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    } 
})

module.exports = router;
