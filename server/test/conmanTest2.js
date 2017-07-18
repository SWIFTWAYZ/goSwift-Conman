var loadtest = require('loadtest');

var rider_id = 5589;
var counter = 0;

//sandton
var centerPoint = { 
    latitude: -26.092426,
    longitude: 28.048279
    //-26.029246, 28.033959 - wroxham street, paulshof
};

function statusCallback(error, result, latency) {
  counter++;
  /*console.log('Current latency %j, result %j, error %j', latency, result, error);
  console.log('----');
  console.log('Request elapsed milliseconds: ', result.requestElapsed);
  console.log('Request index: ', result.requestIndex);
  console.log('Request loadtest() instance index: ', result.instanceIndex);*/
}


var options = {
    url: 'http://localhost:3000/getvehiclesnear/:'+rider_id,
    concurrency: 1,
    maxRequests: 50,
    method: 'POST',
    contentType: 'application/json',
    headers: {
    "authToken": 'eyJ0eXAiOiJKV1QiLCJhbG'
    },
    requestIndex: 0,// set initial value to use in request body
    requestGenerator: function(params, options, client, callback)
     {
     var latlng = randomize(centerPoint,26000,rider_id);
     //var id = parseInt(rider_id)+parseInt(params.requestIndex);
     var body = {
        "latitude": latlng.latitude,
        "longitude": latlng.longitude,
        "rider_id": latlng.rider_id+"",
        "user_id": params.requestIndex        
      };

    params.requestIndex += 1; // increase the requestIndex  value
    var message = JSON.stringify(body);
    options.headers['Content-Length'] = message.length;
    options.headers['Content-Type'] = 'application/json';

    var request = client(options, callback);
    request.write(message);
    return request;
   },
   statusCallback: statusCallback
};

 function randomize(center, radius,id) {
        var y0 = center.latitude;
        var x0 = center.longitude;
        var rd = radius / 111300; //about 111300 meters (111 km) in one degree

        var u = Math.random();
        var v = Math.random();

        var w = rd * Math.sqrt(u);
        var t = 2 * Math.PI * v;
        var x = w * Math.cos(t);
        var y = w * Math.sin(t);

        //Adjust the x-coordinate for the shrinking of the east-west distances
        var xp = x / Math.cos(y0);

        var newlat = y + y0;
        var newlon = x + x0;
        var newlon2 = xp + x0;
        return {
            'latitude': newlat.toFixed(5),
            'longitude': newlon.toFixed(5),
            'longitude2': newlon2.toFixed(5),
            'rider_id': id
        };
    }

loadtest.loadTest(options, function (error, result) {
   if (error) {
      return console.error('Got an error: %s', error);
   }
   else{
    console.log(result);
   }
  console.log('Tests run successfully');
});