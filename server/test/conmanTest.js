var loadtest = require('../../loadtest/lib/loadtest.js');
//var loadtest = require("loadtest.js");
var vehicle_count = 5589;

function optionsObject() {
  vehicle_count++;
  console.log("options testing...."+vehicle_count);
  return { 
  url: 'http://localhost:3000/updatelocation/:'+vehicle_count,
  maxRequests: 40,
  concurrency: 1,
  method: 'POST',
  contentType: 'application/json',
  body: {
     latitude: '-26.087295',
     longitude: '28.048183',
     vehicle_id: "'"+vehicle_count+"'"
        }
   }
 }

loadtest.loadTest(optionsObject(), function (error, result) {
           
            if (error) 
            {
             console.log('Got an error: %s', error);
            } else {
               console.log("testing....")
             console.log(result);
            }
  });