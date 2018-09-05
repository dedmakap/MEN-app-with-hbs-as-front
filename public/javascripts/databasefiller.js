var User = require('../../database/user');
var mongoose = require('mongoose');
var list = [];
var bcrypt = require('bcrypt');

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand) ;
    return rand;
}

function getRandomEmail(){
    var suffix = '';
    for (let i = 0; i < 4; i++) {
        suffix += String(randomInteger(1,1000));
    }
    var email = 'email' + suffix + '@mail.ru';
    return email
}

function generateIvan(i) {
    var ivan = {}
    var firstName = 'Ivan Ivanov';
    var email = getRandomEmail();
    var userName = 'testIvan' + i;
    var password = bcrypt.hashSync('1234', 10);
    var age = randomInteger(10, 100);
    var role = { _id: "5b8ce284945dc819893a55d1"};
    ivan.firstName = firstName;
    ivan.email = email;
    ivan.userName = userName;
    ivan.password = password;
    ivan.age = age;
    ivan.role = role._id
    return ivan;
}

mongoose.connect("mongodb://localhost:27017/test", function () {
    for (let i = 0; i < 70; i++) {
        list.push(generateIvan(i))
        
    }
    User.insertMany(list, function() {
        console.log('done')
    });
})