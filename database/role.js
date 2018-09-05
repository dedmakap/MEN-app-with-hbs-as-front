var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roleScheme = new Schema({
    name : String,
});

var Role = mongoose.model("Role", roleScheme);

module.exports = Role;
