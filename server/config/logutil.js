/*var log4js = require("log4js");

log4js.configure(__dirname + "/logging.json") // Path to the config above
logger = log4js.getLogger();

module.exports = logger;*/

//logger.error("This send you an email!");
//logger.info("But won't.");

/**
 * Created by tinyiko on 2017/05/13.
 */
var logger = require('tracer').colorConsole(
    {
        format : [
            "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})", //default format
            {
                error : "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}" // error format
            }
        ],
        dateformat : "HH:MM:ss.L",
        preprocess :  function(data){
            data.title = data.title.toUpperCase();
        }
    });

/*logger.pretty = function(){
    var prettified = util.inspect(vehicles, {depth: null, colors: true});
    return prettified;
}*/
exports.logger = logger;