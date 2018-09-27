var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logScheme = new Schema({
  timestamp: String,
  level: String,
  message: String,
})

var Log = mongoose.model('Log', logScheme);

module.exports = Log;

// var appRoot = require('app-root-path');
// var logger = require(`${appRoot}/utils/logger`);

// {
//   logger.error(err.message);
//   return res.status(500).json({error: true, message: err.message});
// }