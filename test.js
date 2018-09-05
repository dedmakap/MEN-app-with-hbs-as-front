var User = require('./database/user');
var Role = require('./database/role');
var mongoose = require('mongoose');
var connect = require('./database/index').connectToDb;
connect();

// var userRole = new Role({
//     name: 'User'
// });

// userRole.save(function (err) {
//     if (err) return console.log(err);
//     var user1 = new User({
//         firstName: 'New Ivan',
//         email: 'testemail2@mail.ru',
//         userName: 'testIvan',
//         password: '1234',
//         role: userRole._id,
//         age: 33
//     });

//     user1.save(function (err) {
//         if (err) return console.log(err);
//         console.log(user1);
//     });
// });

Role.findOne({name: 'admin'}, function (err, data) {
    if (err) return console.log(err);
    var user1 = new User({
        firstName: 'New Ivan',
        email: 'testemareil3@mail.ru',
        userName: 'testIvan',
        password: '1234',
        // role: data._id,
        age: 33
    })

    user1.save(function (err) {
        if (err) return console.log(err);
        console.log(user1);
    })
})

// User.findOne({email: 'testemail3@mail.ru'}).
// populate('role', 'name').
// exec(function (err, data) {
//     if (data.role.name === 'admin') {
//         console.log('admin');
//     }
// })