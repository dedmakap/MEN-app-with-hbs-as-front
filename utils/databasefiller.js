// var User = require('../../database/user');
// var mongoose = require('mongoose');
var list = [];
var bcrypt = require('bcrypt');
const db = require('../models');

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
    var fullname = 'Ivan Ivanov';
    var email = getRandomEmail();
    var username = 'testIvan' + i;
    var password = bcrypt.hashSync('1234', 10);
    var age = randomInteger(10, 100);
    var roleID = 2;
    ivan.fullname = fullname;
    ivan.email = email;
    ivan.username = username;
    ivan.password = password;
    ivan.age = age;
    ivan.roleID = roleID;
    return ivan;
}

function insertIvans () {
    for (let i = 0; i < 70; i++) {
        list.push(generateIvan(i))
    }
    // console.log(list);
    db.User.bulkCreate(list)
    .then(console.log("done"))
}

insertIvans();