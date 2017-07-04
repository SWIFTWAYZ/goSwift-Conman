"use strict";


var SwiftDbProvider = require("../../model/swiftdb_scheme").SwiftDbProvider;
var mongoose = require("mongoose");
var logger = require("../../config/logutil");
var distance = require("./distance");

/**
 * Method called by customer devices to get location using their order or mobile no as reference
 * method is used to get location of delivery truck by using orderNumber or mobile_no
 * first retrieve orderNum from following tables.
 *    -> [customers ^ mobile]
 *    -> [orders ^ customer_id]
 *    -> [deliveries ^ order_id]
 *    -> [vehiclelocations ^ driver_id]
 * @param request
 * @param response
 */

exports.getLocationByOrderNum = function(request, response){
	var orderNum = "ZUL004";
	//if(mongoose.models.Orders){
		var Orders = SwiftDbProvider.Orders;//mongoose.model("Orders");
		Orders.findOne({orderNumber:orderNum},function(error,orderDoc){
			if(error){
				logger.error(error);
				response.send("401");
			}
			else {
				console.log(orderDoc);
				var order_Id = orderDoc._id;
				console.log("order id ====> " + order_Id);

				if (mongoose.models.Deliveries) {

					var deliver = mongoose.model("Deliveries");
					deliver.findOne({orderId:order_Id},function(error,deliveryDoc){
						console.log("delivery document = " + deliveryDoc + ","+deliveryDoc._id);
						if (error) {
							console.debug(error);
							response.send("401");
						}
						else if (deliveryDoc) {
							var driver_Id = deliveryDoc['driverId'];
							console.log("driver_id ==" + deliveryDoc.driverId); //getting null doc here

							var VehicleLocations = SwiftDbProvider.VehicleLocations;//mongoose.model("VehicleLocations");
							VehicleLocations.find({driverId: driver_Id}, function (error, locationDoc) {
								if (error) {
									logger.error(error);
									response.send("401");
								}
								else {
                                    var userLocation = [parseFloat(request.body.latitude),parseFloat(request.body.longitude)]
                                   // distance.getDistance(locationDoc.locationGPS,userLocation,4);
                                    console.log("distance between " + locationDoc.locationAddress + "==" + userLocation);
									console.log(locationDoc);
									response.json(locationDoc);
								}
							}).limit(15);
						}
					})
				}
			}
		})
	//}
}

/**
 *  ETA is calculated as time when driverGPS was logged + time it takes to travel
 *  distance from driverGPS to customerGPS (e.g. driver was seen at X around 12:09 PM, the customer
 *  was 10 km away at Y, it takes 30 minutes to travel from X to Y, thus ETA is 12:39 PM. Include
 *  delay at intermediate stops before reaching customer.
 *
 *  Distance is calculated simplistically as the straight line distance using the haversine algorithm.
 *  Will be improved in future to be based on quickest route taking into account traffic factors etc.
 * @param request
 * @param response
 */
exports.getDistanceAndTimeOfArrival = function(request,response){
    var driver_Id = request.body.driverId;
    var VehicleLocations = SwiftDbProvider.VehicleLocations;//mongoose.model("VehicleLocations");
    VehicleLocations.find({driverId: driver_Id}, function (error, locationDoc) {
        if (error) {
            logger.error(error);
            response.send("401");
        }
        else {
            var userLocation = [parseFloat(request.body.latitude),parseFloat(request.body.longitude)]
            var mileage = distance.getDistance(locationDoc.locationGPS,userLocation,4);
            console.log("distance between " + locationDoc.locationAddress + "==" + userLocation + "is ==" + mileage);
            console.log(locationDoc);
            var etaObj = {"_id:" : locationDoc._id,
                        "distance": mileage,
                        "ETA": "12:35 AM"
                }
            response.json(etaObj);
        }
    }).limit(15);
}

/**
* Method that calls DISPATCH through a TChannel RPC call 
* @lat, latitude of vehicle GPS position
* @lon, longitude of vehicle GPS position
*/
var updateVehicleLocation = function(lat,lon){
	console.log("CONMAN:-> calling updateVehicleLocation = "+ lat+","+lon);
	GLOBAL.client_channel.request({
            serviceName: "server",
            timeout: 2000
    }).send('function1',lat,lon,onResponse);

    function onResponse(err,response,arg2,arg3){
        if(err){
            console.log("function1 error ->" + err);
            //finish(err); not defined, crashes application 
        }
        else{
        	//response.json({"result_id":"0"});
            console.log(":Client->function1 response ->"+ response + "from server-"+arg3.toString())
        }
    }
}
/**
 * Method used to update customer info in table Customers,
 * also calls updateCustomerLocation()
 * @param request
 * @param response
 */
exports.updatelocation = function(request, response){
	updateVehicleLocation(request.body.latitude,request.body.longitude); //calling TChannel function

	console.log("called goSwift-dispatch updateVehicleLocation-----lat:" + request.params.lat +"lon="+request.params.lon);
	//console.log("calling http:updatelocation");
	console.log(request.body);
	var Customer,CustomerLocation;
	
	/*
	//if(mongoose.models.Customers){
		var Customer = SwiftDbProvider.Customers;//mongoose.model("Customers");
		if(false){
		var newCustomer = new Customer({
			firstname: request.body.firstname,
			lastname: request.body.lastname,
			mobile: request.body.mobile
		});
		newCustomer.save(function(error, result){
			if(error){
				logger.error("error saving customer: " + error);
			}
			else{
				console.log("successfully saved customer->updatelocation: " + result._id);
				updateCustomerLocation(request, response,result._id);
			}
		});
	}*/
	//}
};

/***
 * Method called by Android/iOS app from driver phone to udpate the location
 * of delivery vehicle.
 * @param request
 * @param response
 */
var updateVehicleLocationXXXX = function(request,response){
	//need to fix this section to update correct id

}
/**
 * method use to save customer GPS location data to CustomerLocations model
 * @param request
 * @param response
 * @param _id
 */
var updateCustomerLocation = function(request,response,_id){
	console.log("attempting to update customer location :" + request.body.latitude + "--"+request.body.address)
	var CustomerLocation, newCustomerLocation;
	//if(mongoose.models.CustomerLocations){
		CustomerLocation = SwiftDbProvider.CustomerLocations;//mongoose.model("CustomerLocations");
		newCustomerLocation = new CustomerLocation({
			customerId:_id, //hard-coded the customerId
			locationAddress: request.body.address,
			locationGPS: [parseFloat(request.body.latitude),parseFloat(request.body.longitude)],
		});

		newCustomerLocation.save(function(error,result){
			if(error){
				logger.error("error saving customer location: " + error);
				response.send("304");
			}
			else{
				logger.debug("successfully saved customer location: " + result._id);
				response.send("201");
			}

		})
	//}
}

/**
 * method use to save driver GPS location data to VehicleLocations model
 * @param request
 * @param response
 * @param _id
 */
 exports.updateDriverLocation = function(request,response){

	var phoneNumber = request.body.mobile;
	var DriverLocation, newDriverLocation;

	 console.log("attempting to update driver location :" + request.body.latitude +
		 "--"+ " phone :"+phoneNumber);
	//if(mongoose.models.CustomerLocations){

	 var Drivers = SwiftDbProvider.Drivers;
	 var driverId;
	 Drivers.findOne({mobile:phoneNumber}).then(function(document) {
		 driverId = document._id;
		 console.log("udpate driver location for : = " + phoneNumber + "_id:" + driverId);

		 newDriverLocation.save(function (error, result) {
			 if (error) {
				 logger.error("error saving driver location: " + error);
				 response.send("304");
			 }
			 else {
				 logger.debug("successfully saved driver location: " + result._id);
				 response.send("201");
			 }

		 })
	 });
	DriverLocation = SwiftDbProvider.VehicleLocations;//mongoose.model("CustomerLocations");
	newDriverLocation = new DriverLocation({
		driverId:driverId, //hard-coded the customerId
		locationAddress: request.body.address,
		locationGPS: [parseFloat(request.body.latitude),parseFloat(request.body.longitude)],
	});

	//}
}