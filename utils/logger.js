var winston = require('winston');
var appRoot = require('app-root-path');
var Transport = require('winston-transport');
var Log = require('../database/log');

var { printf, combine, timestamp, } = winston.format;

var logFormat = printf((info) => {
  return `\n>> ${info.timestamp} : ${info.level} : ${info.message}`
})

class LogToDatabase extends Transport {
  constructor(opts) {
    super(opts);
  }

  log(info, callback) {
    var log = new Log({
      timestamp: new Date(),
      level: info.level,
      message: info.message,
    })
  log.save().then(callback())
  }
}

var options = {
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true,
    format: combine(
      timestamp(),
      logFormat,
    ),
  },
  database: {
    level: 'warn',
    handleExceptions: true,
    json: true,
  }
};


var logger = winston.createLogger({
  transports: [
    new winston.transports.Console(options.console),
    new LogToDatabase(options.database),
  ],
  exitOnError: false,
}) 

logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  }
}

module.exports = logger;