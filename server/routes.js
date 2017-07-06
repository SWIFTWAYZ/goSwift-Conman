'use strict';

var bodyParser 	= require("body-parser");
var config = require("./config/index");
var express 	= require("express");
//var logger = require("./config/logger");
var logger = require("./config/logutil");
var locationcontroller = require('./api/location/location.controller');

var router = express.Router();

module.exports = function(app){
	//------------------ middleware-----------------------------
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//app.use(express.logger({"stream": logger.stream})); //pipe express debugs to logger
//to serve static assets (e.g. images, css and static html)
app.use("/",express.static(config.root +'./client'));

app.route('/*')
    .get(function(req, res) {
    	console.log("root : "+config.root + 'client/');
      res.sendFile(config.root + 'client/');
    });
//app.use("/",express.static(__dirname +'/public'));

app.route("/getvehiclesnear/:orderid").post(locationcontroller.updatelocation);
app.route("/updatelocation/:vehicle_id").post(locationcontroller.logDriverPosition);

};

