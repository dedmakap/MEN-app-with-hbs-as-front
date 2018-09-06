var mongoose = require('mongoose');


function connectToDb() {
    mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true })
}

module.exports = {
    connectToDb,
}