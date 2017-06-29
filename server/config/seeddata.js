var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/swiftdb2');

var dir = './seeds';
var db = mongoose.connection;

// Show connection error if there is one
db.on('error', console.error.bind(console, 'Database Connection Error:'));

// If we successfully connected to mongo
db.once('open', function callback() {

    var fs = require('fs'); // Used to get all the files in a directory

    // Read all the files in the folder
    fs.readdir(dir, function(err, list) {

        if(err) {
            console.log('Error: '+err);
        }

        // For every file in the list
        list.forEach(function(file) {

            // Set the filename without the extension to the variable collection_name
            var collection_name = file.split(".")[0];
            var parsedJSON = require(dir + '/' + file);
            var collectionName = "collection name = " + collection_name;
            var filepath = "filename: "+dir + '/' + file;
            var noOfObjects = + "parsedJSOn.length :"+ parsedJSON.length;

            console.log(collectionName + filepath + noOfObjects);
            console.log("parsed JSON = " + JSON.stringify(parsedJSON));
            /*
             * first remove all documents in the collection
             */
            db.collection(collection_name).remove({},function(error,records){
                if(error){
                    console.log("error" + error);
                }
                else{
                    console.log(": document = " + records);
                }
            });

            /**
             * then iterate over each parsedJSON and insert in the datase
             */
            for(var i = 0; i < parsedJSON.length; i++) {
                console.log("colletion_name =" + collection_name);
                console.log("--------------------");
                console.log(parsedJSON);
                // Counts the number of records in the collection
                db.collection(collection_name).count(function(err, count) {
                    if(err) {
                        console.log(err);
                    }
                });

                db.collection(collection_name).insert(parsedJSON[i], function(err, records) {
                    if(err) {
                        console.log(err);
                    }
                    console.log(records[0]);
                    console.log("Record added as "+records[0]);

                });
            }

        });
    });
});