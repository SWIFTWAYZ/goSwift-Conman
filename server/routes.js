'use strict';

var bodyParser 	= require("body-parser");
var config = require("./config/index");
var express 	= require("express");
//var logger = require("./config/logger");
var logger = require("./config/logutil");
var usercontroller = require('./api/user/user.controller');
var locationcontroller = require('./api/location/location.controller');
var drivercontroller = require('./api/driver/driver.controller');
//var deliveriescontroller = require('./api/deliveries/deliveries.controller');
//var retailercontroller = require('./api/retailer/retailer.controller.js');
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
app.route("/userlist").get(usercontroller.index);
app.route("/createuser").post(usercontroller.create);
app.route("/deletebyid/:id").delete(usercontroller.deleteById);
app.route("/userbyid/:id").get(usercontroller.retrieveById);

app.route("/vehiclelocation/:orderid").get(locationcontroller.getLocationByOrderNum);
app.route("/updatelocation/:orderid").post(locationcontroller.updatelocation);
app.route("/updatedriverlocation").post(locationcontroller.updateDriverLocation)

app.route("/registerdriver").post(drivercontroller.updateDriver);
app.route("/driverlist").get(drivercontroller.getDrivers);
app.route("/deletedriver/:id").delete(drivercontroller.deleteById);
app.route("/driverbyid/:id").get(drivercontroller.getDriverById)
    //app.route("/deliveries").get(deliveriescontroller.getDrivers);


//console.log(router.stack);

};

