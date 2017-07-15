var log4js = require("log4js");

log4js.configure(__dirname + "/logging.json") // Path to the config above
logger = log4js.getLogger();

module.exports = logger;

//logger.error("This send you an email!");
//logger.info("But won't.");