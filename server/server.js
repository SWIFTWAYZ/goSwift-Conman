var express 	= require("express");
var Tchannel = require("tchannel");
var TChannelThrift = require("tchannel/as/thrift");
var mongoose = require("mongoose");
var smpp = require("./sms/smppService");
var path = require('path');
var logger = require("./config/logutil").logger;
var config = require("./config/index");

var app = express();
require("./routes")(app);
var t_client = new Tchannel();

global.client_channel = t_client.makeSubChannel({
        serviceName: 'server',
        peers: ['127.0.0.1:4040'],
        requestDefaults: {
            hasNoParent: true,
            headers: {
                'as': 'raw',
                'cn': 'example-client'
            }
        }
 });


//------------------------set PORT and listen--------------------------------
app.set('port', process.env.PORT||3000);
app.listen(app.get('port'),function(){
	logger.log("Server listening for connections on port..." + app.get("port"));
	logger.log("root directory :" + config.root);
	
	//initialize data	
	app._router.stack.forEach(function(r){
  	if (r.route && r.route.path){
    	logger.debug(r.route.path)
  	}
	});
	//console.log(app._router.stack);
});

exports = module.exports = app;
