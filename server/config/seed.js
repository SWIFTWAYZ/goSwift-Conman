
	var SwiftDbProvider = require("../model/swiftdb_scheme").SwiftDbProvider;
	var mongoose = require("mongoose");

//-----------------start of data loading ---------------------------

	var loadData = function () {
		console.log("started seeding data");
		if (mongoose.models.Orders) {
			Orders = mongoose.model("Orders");
			var currentOrder = new Orders({
				orderNumber: "ZUL005",
				orderDate: Date.now(),
				orderAmount: 744.56,
				deliveryDate: Date.now()
			});
			currentOrder.save(function (error, results) {
				handleResults(error, results, "Orders");
			})
		}
		if (mongoose.models.Vehicles) {
			Vehicles = mongoose.model("Vehicles");
			var vehicles = new Vehicles({
				vehicleLicenseNo: "ZDW066GP",
				vehicleMake: "Nissan",
				vehicleColor: "White",
				vehicleModel: "NPV2000",
				vehicleType: "Bakkie",
				vehicleDescription: "White bakkie with canopy"
			});
			vehicles.save(function (error, results) {
				handleResults(error, results, "Vehicles");
			});
		}
		if (mongoose.models.Drivers) {
			Drivers = mongoose.model("Drivers");
			driver = new Drivers({
				vehicleId: "56a7a99d375f3ee039f6d7c6",
				deviceId: "0847849574",
				firstname: "Ishmael",
				lastname: "Valoyi",
				mobile: "0847849574",
				email: "ishvaloyi@gmail.com",
				licenseNumber: "40990007BVGD"
			});
			driver.save(function (error, results) {
				handleResults(error, results, "Driver");
			});
		}

		if (mongoose.models.Deliveries) {
			Deliveries = mongoose.model("Deliveries");
			var delivery = new Deliveries({
				delivery_date: Date.now(),
				driverId: "56a7a045d3350dd5353be94e",
				orderId: "56a7a7bc48de1a1139762ab4"
			});
			delivery.save(function (error, results) {
				handleResults(error, results, "Deliveries");
			});
		}

		if (mongoose.models.VehicleLocations) {
			VehicleLocations = mongoose.model("VehicleLocations");
			var vehicleloc = new VehicleLocations({
				driverId: "56a7a045d3350dd5353be94e",
				locationAdress: "Park station, Johannesburg",
				locationGPS: [-26.194539, 28.042033]
			});

			vehicleloc.save(function (error, results) {
				handleResults(error, results, "vehiclelocation");
			});
		}
		//-----------------end of data loading ---------------------------
	};

	function handleResults(error, results, modelname) {
		if (error) {
			console.log("error saving " + modelname + ": " + error);
		}
		else {
			console.log("successfully saved " + modelname + ": " + results._id);
			//updateCustomerLocation(request, result._id);
			if (results instanceof VehicleLocations) {
				console.log("instanceof for vehiclelocaiton is true");
			}
			else {
				console.log("instanceof for vehiclelocaiton is false");
			}
		}
	}

	loadData();