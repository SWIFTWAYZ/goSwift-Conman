"use strict";

var SwiftDbProvider = require("../../model/swiftdb_scheme").SwiftDbProvider;
var smpp = require("../../sms/smppService");
var mongoose = require("mongoose");
var logger = require("../../config/logutil");

//----------------------driver-----------------------------------------------------
exports.updateDriver = function(request,response){
	logger.info(request.rawHeaders);
	logger.info(request.headers);
	logger.info(request.body);

	//if(mongoose.models.Drivers){
		//Drivers = mongoose.model("Drivers");
		var driver = new SwiftDbProvider.Drivers(request.body);
		driver.save(function(error,results){
			handleResults(error,results,"Drivers");
			console.log("--------------driver--------------");
			console.log(results);
			response.json(results);
			smpp.connectSMPP();
			logger.info("SMPP server connected");
			smpp.sendSMS(driver.mobile,"Your Zulzi parcel is coming, please open link to track it \n" + 
				request.headers.origin +"/#/locationview");
		});
	//}

	function handleResults(error,results,modelname){
		if(error){
			console.log("error saving " +modelname+": " + error);
		}
		else{
			console.log("successfully saved "+modelname+": " + results._id);
		}
	}
}

exports.getDrivers = function(request,response){
//getDrivers = function(){
		var Drivers = SwiftDbProvider.Drivers;
		Drivers.find({},function(error,document){
            console.log(document);
            response.json(document);
		});
}

exports.getDriverById = function (request, response) {
//getDriverById = function(){
    var driverId = request.param.id; //"56a8e132c94109e3330046eb";
    if(mongoose.models.Drivers) {
        var Drivers = mongoose.model("Drivers");
        //Drivers.find({_id:driverId},function(error,document){
		Drivers.findById(driverId,function(error,document){
            console.log(document);
            response.json(document);
        });
    }
}

exports.deleteById = function(request,response){
	//deleteById = function(id){
	var id = request.params.id;
	if(mongoose.models.Drivers) {
		var Drivers = mongoose.model("Drivers");
		Drivers.remove({_id:id},function(error,document){
			console.log("removed driver with _id : " + document);

			//if(error) response.send("401");
			response.json(document);
		});
	}
}

var getDriverVehicle = function(driverId){
	var Drivers = mongoose.model("Drivers");
	Drivers.findById(driverId)
		.populate('vehicleId')
		.exec(function(error,doc){
			console.log("------------------------")
		console.log(doc);
	});
}

getDriverVehicle("56a8dfd06ae60b333301db19");
//deleteById("56a8e0026ae60b333301db1c");
//getDriverById();
//getDrivers();