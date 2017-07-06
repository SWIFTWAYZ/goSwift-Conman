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
var updateVehicleLocation = function(lat,lon){
	/*----------------------TChannel Thrift request ---------------*/
		console.log("CONMAN:-> calling updateVehicleLocation = "+ lat+","+lon);
		tchannelThrift.request({
	        serviceName: 't-server',
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
	            console.log('got resp', resp);
	        }

	        //server.close();
	    }

/*----------------------TChannel Raw request ---------------*/
	global.client_channel.request({
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
	
	
};

