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
    }
});

var User = mongoose.model("User", userScheme);

module.exports = User;
