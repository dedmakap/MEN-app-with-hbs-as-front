var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Role = require('./role');

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

userScheme.pre('save', function (next) {
    
    if (!this.role) {
        Role.findOne({name:'user'}, (err, data) => {
            if (err) return console.log(err);
            this.role = data._id;
            next();
    })
    }

})

var User = mongoose.model("User", userScheme);


module.exports = User;
