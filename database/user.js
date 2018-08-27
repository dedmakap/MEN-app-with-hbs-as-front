var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userScheme = new Schema({
    firstName : String,
    email : {
        type: String,
        unique: true
    },
    userName : String,
    password : String,
    role : {
        type: String,
        default: 'user'
    },
    avatar : {
        type : String,
    }, 
    age : {type : String}
});

var User = mongoose.model("User", userScheme);

module.exports = User;
