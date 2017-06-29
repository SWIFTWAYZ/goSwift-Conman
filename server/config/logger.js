var winston = require("winston");

winston.emmitErrs = true;

var console_appender = new winston.transports.File({
    level: 'info',
    filename: './logs/debug.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    colorize: false
});
var file_appender = new winston.transports.Console({
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
});

var logger = new winston.Logger({
    transports: [console_appender,file_appender],
    exitOnError: true
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};