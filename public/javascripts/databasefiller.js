var User = require('../../database/user');
var mongoose = require('mongoose');
var list = [];

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
    var password = '1234';
    var age = randomInteger(10, 100);
    ivan.firstName = firstName;
    ivan.email = email;
    ivan.userName = userName;
    ivan.password = password;
    ivan.age = age;
    return ivan;
}

mongoose.connect("mongodb://localhost:27017/test", function () {
    for (let i = 0; i < 150; i++) {
        list.push(generateIvan(i))
        
    }
    User.insertMany(list, function() {
        console.log('done')
    });
})