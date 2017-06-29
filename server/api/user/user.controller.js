var SwiftDbProvider = require("../../model/swiftdb_scheme").SwiftDbProvider;
var mongoose = require("mongoose");
//var logger = require("../../config/logger");
var logger = require("../../config/logutil");

/**
 * Method is used to retrieve all users
 * @param request
 * @param response
 * ------------------ HTTP GET----------------------------------
 */

exports.index = function(request,response){
    console.log("HTTP get method called :");
    var Users;
    if(mongoose.models.Users){
        Users = mongoose.model("Users");
        Users.find({},function(error,data){
            logger.info ("mongoose retrieve Users : --> Total=" + data.length);
            response.json(data);
        });
    }
};

/**
 * Method used to retrieve User data by ID
 * @param request
 * @param response
 * ---------------------retrieve by ID------------------------------------
 */

exports.retrieveById = function(request,response){
    var id = request.params.id;
    console.log("HTTP get called findByID:" + id);
    if(mongoose.models.Users){
        Users = mongoose.model("Users");
        Users.find({_id:id},function(error,doc){
            if(error){
                logger.error("error retrieving doc with id:" + id);
            }
            else{
                console.log(doc);
                response.json(doc);
            }
        });
    }
};

/**
 * Method used to delete by ID
 * @param req
 * @param resp
 * ---------------------HTTP DELETE-----------------------------
 */

exports.deleteById = function(req,resp){

    var id = req.params.id;
    console.log("HTTP delete called id:" + id);
    //db.users.delete({firstname: "James"})

    var Users;
    if(mongoose.models.Users){
        //if model is already created, just find it
        Users = mongoose.model("Users");
        Users.remove({_id:id}, function(error, result){
            console.log("did you delete record? :" + result);
            resp.json(result);
        });
    }
};

/**
 * Method to create new user in table [Users]
 * @param request
 * @param response
 * ---------------------HTTP POST--------------------------------
 */

exports.create = function(request, response){
    console.log("HTTP post called :" +
        request.body.firstname +"-"+ request.body.lastname +
        ", pwd = " + request.body.hashstring);
    request.body.salt = "$&salti__"; //hard-coded, please change!!!
    console.log (request.body);

    if(mongoose.models.Users){
        Users = mongoose.model("Users");

        var newUser = new Users(request.body);
        newUser.save(function(error, result){
            if(error){
                logger.error("error saving user : " + error);
            }else{
                console.log("New user saved: " + result._id);
                response.json(result);
            }
        });
    }
};	


