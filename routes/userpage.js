var express = require('express');
var router = express.Router();
var User = require('../database/user');
var multer = require('multer');
var path = require("path");
var fs = require("fs");
var Role = require('../database/role');
var ajaxAuth = require('../middlewares/ajaxauth');
var upload = multer({ dest: './public/images' });
var { checkGuestRole,
  checkAuth,
  checkAuthReact,
  checkAdminRoleReact,
} = require('../middlewares/checkauth');
var appRoot = require('app-root-path');
var logger = require(`${appRoot}/utils/logger`);
var UserSQL = require('../models/index').User;
var db = require('../models');




router.get('/:id', checkAuth, checkGuestRole, function (req, res) {
  var { id } = req.params;
  var avaPath = path.join(__dirname, "../public/images/");
  var avaFile;
  User.findOne({ _id: id })
    .populate('role', 'name -_id')
    .exec(function (err, owner) {
      if (err) {
        logger.error(err.message);
        return res.status(500).json({ error: true, message: err.message });
      }
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


router.post('/api/:id', checkAuthReact, checkAdminRoleReact, upload.single('file'), function (req, res) {
  console.log('wow so cool', req.file);
  if (!req.file) return res.end();
  let query = {
    where: { 'id': req.params.id },
    include: [{ model: db.Role }],
    attributes: { exclude: ['password'] },
  }
  return UserSQL.findOne(query)
    .then(user => {
      user.avatar = req.file.filename;
      user.save()
        .then(()=> {
          return res.json(user);
        })
        .catch(err=> {
          logger.error(err.message);
          return res.status(500).json({ error: true, message: err.message });
        }
        );
    })

  // User.findOneAndUpdate(
  //   { _id: req.params.id },
  //   { avatar: req.file.filename },
  //   { new: true },
  // )
  //   .populate('role', 'name -_id')
  //   .exec(
  //     function (err, data) {
  //       if (err) {
  //         logger.error(err.message);
  //         return res.status(500).json({ error: true, message: err.message });
  //       }

  //       return res.json(data.toResponse());
  //     })
})

router.put('/:id', ajaxAuth, function (req, res) {
  if (req.body.roleId) {
    return Role.findOne({ _id: req.body.roleId }, function (err, data) {
      if (err) {
        logger.error(err.message);
        return res.status(500).json({ error: true, message: err.message });
      }
      if (!data) return res.end()
      User.findOneAndUpdate({ _id: req.params['id'] }, { role: data._id }, function (err) {
        if (err) {
          logger.error(err.message);
          return res.status(500).json({ error: true, message: err.message });
        }
        return res.json({
          name: data.name
        });
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
    if (err) {
      logger.error(err.message);
      return res.status(500).json({ error: true, message: err.message });
    }
    return res.end();
  })
})


module.exports = router;
