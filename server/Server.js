var express 	= require("express");
var mongoose = require("mongoose");
var smpp = require("./smppService");
var path = require('path');
var logger = require("./config/logutil");
var config = require("./config/index");

var SwiftDbProvider = require("./model/swiftdb_scheme").SwiftDbProvider;

//var Schema = mongoose.Schema;
var app = express();
require("./routes")(app);

//------------------------set PORT and listen--------------------------------
app.set('port', process.env.PORT||3000);
app.listen(app.get('port'),function(){
	logger.info("Server listening for connections on port..." + app.get("port"));
	logger.debug("root directory :" + config.root);
	
	//initialize data	
	app._router.stack.forEach(function(r){
  	if (r.route && r.route.path){
    	logger.debug(r.route.path)
  	}
	});
	//console.log(app._router.stack);
});

exports = module.exports = app;
