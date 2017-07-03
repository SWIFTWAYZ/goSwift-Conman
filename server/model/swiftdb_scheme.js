(function () {

	var DbProvider,
		ObjectId,
		UserSchema,
		Users,
		DriversSchema,
		Drivers,
		VehicleSchema,
		Vehicles,
		VehicleLocationSchema,
		VehicleLocations,
		RiderLocationSchema,
		RiderLocations;

	var mongoose = require("mongoose");
	var config = require("../config/index");

	DbProvider = {};
	ObjectId = mongoose.Schema.Types.ObjectId;

	mongoose.connect(config.db_url, function(err,con){
		if(err){
			console.log("no connection :" + err);
		}
		else{
			console.log("Successfully connected to DB :" + con);
		}
	});

	/*
	 * SwiftWayz database schema/model
	 */

	//------------------Users-----------------------------------
	UserSchema = mongoose.Schema({
		deviceId:String,
		firstname: String,
		lastname: String,
		email: String,
		idnumber: String,
		mobile: String,
		birthdate: Date,
		role: {type:String, required:true, default:'customer'}, //manager role??
		username: {type: String, required: true, default: 'anonymous'},
		salt: {type: String, required:true},
		hashstring: {type:String, required:true}
	},{
		toObject:{virtuals:true},
		toJSON:{virtuals:true}
	});
	Users = mongoose.model("Users",UserSchema);
	
	//---------------Driver-------------------------------------
	DriverSchema = mongoose.Schema({
		vehicleId : {type:ObjectId, ref:"Vehicles"},
		deviceId: {type: String, require: true},
		firstname: {type: String, require:true},
		lastname: {type: String, require: true},
		gender: {type: String, default:"male"},
		mobile: {type: String, require: true},
		email: {type: String, require: true},
		licenseNumber: {type:String},//add require:true
		licenseExpiry: {type: Date}, //add require:true
		//location: String,
		role:{type:String, required: true, default:'driver'},
		//salt: {type: String, required:true},
		//hash: {type:String, required:true}

	},{
		toObject:{virtuals:true},
		toJSON:{virtuals:true}
	});

	Drivers = mongoose.model("Drivers",DriverSchema);

	//---------------Vehicle------------------------------------
	VehicleSchema = mongoose.Schema({
		vehicleLicenseNo: String,
		vehicleMake : String,
		vehicleColor: String,
		vehicleModel: String,
		vehicleType: String,
		vehicleDescription: String,
		seatNumber: {type: Number, required: true, default: 4},
		vehicleType: {type: String, default: "bakkie"}
		//["bakkie","tuk-tuk","truck","panel-van","mini-bus"]
	},{
		toObject:{virtuals:true},
		toJSON:{virtuals:true}
	});

	Vehicles = mongoose.model("Vehicles",VehicleSchema);

	//---------------VehicleLocation----------------------------
	VehicleLocationSchema = mongoose.Schema({
		driverId: {type:ObjectId, ref:'Drivers'}, //user driverId instead of vehicleId
		locationAdress: String,
		locationTime: {type:Date, default: Date.now},
		locationGPS: {type:[Number],index:"2d", required: true}
	},{

		toObject:{virtuals: true},
		toJSON:{virtuals:true}
	});
	VehicleLocations = mongoose.model("VehicleLocations",VehicleLocationSchema);

	//--------------RiderLocation----------------------------
	RiderLocationSchema = mongoose.Schema({
		customerId: {type:ObjectId, ref:"Customer"},
		locationAddress: String,
		locationGPS: {type:[Number],index:"2d", required: true},
		locationTime: {type:Date, default: Date.now},
	},{
		toObject:{virtuals:true},
		toJSON:{virtuals:true}
	});
	RiderLocations = mongoose.model("RiderLocations",RiderLocationSchema);

	/*---------------------------------------------------------------
	 * Attach data model to DbProvider and Export
	 */
	DbProvider.Users = Users; //web-app

	DbProvider.Vehicles = Vehicles;//web-app
	DbProvider.VehicleLocations = VehicleLocations; //mobile-app
	DbProvider.RiderLocations = RiderLocations; //mobile-web
	

	/*
	 * Exports
	 */
	exports.SwiftDbProvider = DbProvider;

}).call(this)
