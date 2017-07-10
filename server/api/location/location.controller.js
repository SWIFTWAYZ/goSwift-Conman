"use strict";

var mongoose = require("mongoose");
var logger = require("../../config/logutil");
var distance = require("./distance");
var TChannel = require("tchannel");
var TChannelThrift = require("tchannel/as/thrift");
var fs = require("fs");
var path = require("path");

var thrift_client = TChannel();

var thrift_channel = thrift_client.makeSubChannel({
        serviceName: 't-server',
        peers: ['127.0.0.1:4041'],
        requestDefaults: {
            hasNoParent: true,
            headers: {
                'as': 'thrift',
                'cn': 'example-client'
            }
        }
 });
var tchannelThrift = TChannelThrift({
    channel: thrift_channel,
    source: fs.readFileSync(
        path.join(__dirname, 'thrift', 'tripService.thrift'), 'utf8'
    )
});
var client = global.client_channel;

/**
* Method that calls DISPATCH through a TChannel RPC call (Thrift and Raw)
* @lat, latitude of vehicle GPS position
* @lon, longitude of vehicle GPS position
*/
var updateVehicleLocation = function(lat,lon,cb){
	/*----------------------TChannel Thrift request ---------------*/
		console.log("CONMAN:-> calling updateVehicleLocation = "+ lat+","+lon);
		tchannelThrift.request({
	        serviceName: 't-server',
	        timeout: 3000,
	        headers: {
	            cn: 'echo'
	        }
	    }).send('tripService::getVehiclesNearRider', {
	        someHeader: 'headerValue'
	    }, {
	        lat: parseFloat(lat),
	        lon: parseFloat(lon)
	    }, onResponse2);

	    function onResponse2(err, resp) {
	    	console.log("CONMAN:-> fired thrift onResponse2");
	        if (err) {
	            console.log('got error', err);
	        } else {
	            console.log('vehicles near, size =', resp.body.length);
	            cb(resp);
	        }
	        //server.close();
	    }

}
/**
 * Method used to update customer info in table Customers,
 * also calls updateCustomerLocation()
 * @param request
 * @param response
 */
exports.updatelocation = function(request, response){
	updateVehicleLocation(request.body.latitude,request.body.longitude,function(results){
		response.json(results);
	}); //calling TChannel function

	console.log("goSwift-dispatch updateVehicleLocation--lat:" + 
		request.params.lat +"lon="+request.params.lon);
	
	console.log(request.body);
	var Customer,CustomerLocation;

};

/**
* used to log driver position to dispatch
* @param request
* @param response
*/
exports.logDriverPosition = function(request,response){
	var req_body = request.body;
	console.log(JSON.stringify(request.body));
	console.log(request.body.latitude +","+request.body.longitude +"-"+ request.body.vehicle_id);
	tchannelThrift.request({
		serviceName:"t-server",
		timeout:3000,
		headers: {
			cn:"echo"
		}
	}).send("tripService::updateDriverLocation",{headers:"driverLocHeaders"},
	{
		lat:parseFloat(request.body.latitude),
		lon: parseFloat(request.body.longitude),
		vehicle_id: request.body.vehicle_id
	},onResponse);

	function onResponse(err,resp){
			  if (err) {
	            console.log('got error', err);
	        } else {
	            console.log('got resp...', resp);
	            response.json(resp);
	        }
	}
	//response.json("201");
}
