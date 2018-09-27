var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Role = require('./role');
var appRoot = require('app-root-path');
var logger = require(`${appRoot}/utils/logger`);


var userScheme = new Schema({
    firstName : String,
    email : {
        type: String,
        unique: true
    },
    userName : String,
    password : String,
    role : {
        type: Schema.Types.ObjectId, 
        ref: 'Role'
    },
    avatar : {
        type : String,
    }, 
    age : {type : Number}
});

userScheme.methods.toResponse = function() {
    return {
        _id: this._id,
        firstName: this.firstName,
        email: this.email,
        userName: this.userName,
        role: this.role,
        age: this.age,
        avatar: this.avatar,
    }
}

userScheme.pre('save', function (next) {
    
    if (!this.role) {
        Role.findOne({name:'user'}, (err, data) => {
            if (err) {
                logger.error(err.message);
                return res.status(500).json({error: true, message: err.message});
            }
            this.role = data._id;
            next();
    })
    }

})

var User = mongoose.model("User", userScheme);


module.exports = User;
