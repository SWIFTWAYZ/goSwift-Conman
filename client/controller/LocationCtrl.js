angular.module("SwiftControllers")
	.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider){

		$stateProvider.state('locationview',{
			url: '/',
			templateUrl: 'location_view.html', 
			controller: 'LocationCtrl'
		})

	}])
	.controller("LocationCtrl", function($scope,$http){

		var orderid = "56a7abe6d566cbdf3a794ee7";
		var dt = new Date();
		var dateFormat = "dd/MM/yyyy HH:mm";
		var lat, lng;
		var map;

		//var trip[] = null;

		$scope.name = "Tinyiko";
		$scope.datetime = dt.toUTCString();
		$scope.getVehiclesNear = getVehiclesNear;
		$scope.logDriverPosition = logDriverPosition;

		//------------------------initialize()---------------------------
		/**
		 * Method used to initialize google map and getCurrentLocation using the
		 * geolocation API
		 */
		function initialize() {

			var marker = new google.maps.Marker({
				position: {lat: -26.00091519,lng: 28.0012282},
				map: map,
				draggable: true
			});
			console.log("Initializing map");

			var mapCanvas = document.getElementById('mapBox');
			console.log("map----------" + mapCanvas);
			if (typeof google === 'object' && typeof google.maps === 'object') {
				var mapOptions = {
					center: new google.maps.LatLng(-26.061204,28.087798),
					zoom: 10,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					mapTypeControl: false
				}
				map = new google.maps.Map(mapCanvas, mapOptions);
			}

			setupAutoComplete(map); //setup AutoComplete
			google.maps.event.addListener(map, 'drag', function() {
          		//loc(map);
        	});

        	google.maps.event.addListener(map, 'dragend', function () {
          		loc(map);
        	});

        	document.getElementById('cell').addEventListener('click', function() {
        		console.log("clicked")
        		//logDriverPosition("5567");

        	});


			function loc(map) {
	            /*var x = map.getCenter();
	            console.log("current location = " + x);
	            document.getElementById('dragStatus').innerHTML = x.lat().toFixed(6) + ', ' + x.lng().toFixed(6);*/
	            var center = map.getCenter();
	            lat = center.lat().toFixed(6);
	            lng = center.lng().toFixed(6);

	            window.setTimeout(function() {
					//map.panTo(marker.getPosition;

					marker.setPosition(map.getCenter());
					

					getAddress(center,function(error,results){
						console.log("Google Map Address = " + results + " : new center----" + center);
						$scope.$apply(function(){
							$scope.address = results;
							$scope.gdata = {latitude: center.lat().toFixed(6),
											longitude: center.lng().toFixed(6),
											gps_latlng: center.lat().toFixed(6) + "," + center.lng().toFixed(6)
							};

						});
					});
				}, 0);
        	}

	/*------------------------------------------------*/
		}

		function setupAutoComplete(map){
			var input = document.getElementById('searchInput');
		    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		    var floating_place = new google.maps.places.Autocomplete(input);
		    floating_place.bindTo('bounds', map);

		    var infowindow = new google.maps.InfoWindow();
		    var marker = new google.maps.Marker({
		        map: map,
		        anchorPoint: new google.maps.Point(-26.061204,28.087798)
		        	//0, -29)
		    });

		    floating_place.addListener('place_changed', function() {
		        infowindow.close();
		        marker.setVisible(false);
		        var place = floating_place.getPlace();
		        if (!place.geometry) {
		            window.alert("Autocomplete's returned place contains no geometry");
		            return;
		        }
		  
		        // If the place has a geometry, then present it on a map.
		        /*if (place.geometry.viewport) {
		            map.fitBounds(place.geometry.viewport);
		        } else {
		            map.setCenter(place.geometry.location);
		            map.setZoom(11);
		        }*/
		        map.setCenter(place.geometry.location);
		        map.setZoom(13);
		        marker.setPosition(place.geometry.location);
		        /*
		        marker.setIcon(({
		            url: place.icon,
		            size: new google.maps.Size(71, 71),
		            origin: new google.maps.Point(0, 0),
		            anchor: new google.maps.Point(17, 34),
		            scaledSize: new google.maps.Size(35, 35)
		        }));
		        marker.setPosition(place.geometry.location);
		        marker.setVisible(true);*/
		    
		        var address = '';
		        if (place.address_components) {
		            address = [
		              (place.address_components[0] && place.address_components[0].short_name || ''),
		              (place.address_components[1] && place.address_components[1].short_name || ''),
		              (place.address_components[2] && place.address_components[2].short_name || '')
		            ].join(' ');
		        }
		    
		        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
		        //infowindow.open(map, marker);
		      
		        //Location details
		        for (var i = 0; i < place.address_components.length; i++) {
		            if(place.address_components[i].types[0] == 'postal_code'){
		            	//console.log(place.address_components[i].long_name);
		                //document.getElementById('postal_code').innerHTML = place.address_components[i].long_name;
		            }
		            if(place.address_components[i].types[0] == 'country'){
		                document.getElementById('country').innerHTML = place.address_components[i].long_name;
		            }
		        }
		        document.getElementById('location').innerHTML = place.formatted_address;
		        if(place.geometry.location){
			        document.getElementById('lat').innerHTML = place.geometry.location.lat().toFixed(6);
			        document.getElementById('lon').innerHTML = place.geometry.location.lng().toFixed(6);
		    	}
		    });
		}
	/*------------------------------------------*/
		initialize();

		/*google.maps.event.addDomListener(window, "load", function(){});
		 */

		/**
		 * method listens for dragend event on google map and retrieve LatLng associated
		 * with event
		 * @param markerobject
		 */
		function markerCoords(markerobject){
			google.maps.event.addListener(markerobject, 'dragend', function(evt){
				markerobject.setOptions({
					position: evt.latLng
				});

				infoWindow.setOptions({
					content: '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) +
					' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>'
				});
				console.log("is this center:"+evt.latLng);
			});

			google.maps.event.addListener(markerobject, 'drag', function(evt){
				console.log("marker is being dragged");
			});
		}

		/**
		* log the GPS position of driver
		*/
		function logDriverPosition(vehicle_id){
			vehicle_id = "5578";
			console.log("logDriverPositino ...." + lat + ","+lng+","+vehicle_id);
			var driverposition = {
				latitude: lat,
				longitude: lng,
				vehicle_id: vehicle_id
			};
			if(isNaN(lat) && isNaN(lng)){
				console.log("no location set...");
				 //document.getElementById('gps').innerHTML = "enter location";
				 //$scope.gdata.gps_latlng = "no loc";
				 document.getElementById("gps").style.color = "#FF4500";
				return;
			}
			else{
				//document.getElementById("latlng").style.color = "#000000";
				$http.post("/updatelocation/"+vehicle_id,driverposition).success(function(response){
					console.log(response);
				})
			}
		}
		/**
		 * Method used to update location of customer
		 */
		function getVehiclesNear(){
			var orderid = "ZUL004";
			console.log("updateLocation trigger :");
			console.log($scope.address + "," + lat + "," + lng);

			var locationdata = {
				latitude :lat,
				longitude:lng,
				address: $scope.address,
				firstname: $scope.firstname,
				lastname: $scope.lastname,
				mobile: $scope.mobile
			};

			$http.post("/getvehiclesnear/"+orderid, locationdata).success(function(response){
				console.log("response from goSwift-conman:"+JSON.stringify(response));
				console.log("/updatelocation http-response: " + response.status);

			});

			//getVehicleLocation(orderid);
		}

		/**
		 * callback function invoked when the getCurrentLocation() returns errors
		 * @param error
		 */

		function positionError(error){
			console.log("position err: " + error);
			counter++;
			var myinterval = setInterval(function(){
				console.log("calling geo-location supported :" + counter);
				$scope.address = "Geo-location supported";
				if(counter===4){ clearInterval(myinterval)};
			},5000);
			var message = "";

			// Check for known errors
			switch (error.code) {
				case error.PERMISSION_DENIED:
					message = "You did not grant app permission to use Geolocation";
					break;
				case error.POSITION_UNAVAILABLE:
					message = "Your GPS position could not be determined.";
					break;
				case error.PERMISSION_DENIED_TIMEOUT:
					message = "GPS position can not be determined within timeout period.";
					break;
			}

			if (message == "") {
				var strErrorCode = error.code.toString();
				message = "Your position could not be determined due to " +
					"an unknown error (Code: " + strErrorCode + ").";
			}
			alert("GPS error: " + message);
			$scope.comments = message;
		}

		/**
		 * callback function invoked when the getCurrentLocation() fires successfully
		 * @param position
		 */
		function positionSuccess(position) {
			console.log("positionSuccess");

			var mapCanvas = document.getElementById('mapBox');

			lat = position.coords.latitude.toFixed(6);
			lng = position.coords.longitude.toFixed(6);

			$scope.$apply(function(){
				$scope.gdata = {
					latitude:lat,
					longitude:lng,
					gps_latlng: lat + "," + lng
				};
			});

			var acr = position.coords.accuracy;
			console.log("lat: " + lat + ", lon :" + lng);

			var mapOptions = {
				center: new google.maps.LatLng(lat,lng),
				zoom: 12,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			var map = new google.maps.Map(mapCanvas, mapOptions);
			var geocoder = new google.maps.Geocoder;
			var infowindow = new google.maps.InfoWindow;

			geocodeLatLng(geocoder,map,infowindow,position.coords);
		}

		$scope.keyPressFunc = function(keyEvent) {
			var word = $scope.mobile;
			console.log("clicked = "+keyEvent);
			if(word !== null && typeof word !== 'undefined'){
				console.log("word = " +word);
				if(word.length > 5){
					console.log("long = "+word);
					console.log("gps data = " + $scope.gdata);
					/*getAddress($scope.gdata,function(results){
						console.log("address=="+results);
					}*/
				}
			}
			
		}

		/**
		 * Method used to geocode GPS latlng to address and format into an address string.
		 * @param gdata, LatLng object
		 * @param cb, callback function
		 */
		function getAddress(gdata, cb){
			var geocoder2 = new google.maps.Geocoder;
			geocoder2.geocode({'location': gdata}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					if(results[0] != null && results[1] != null){
						var fulladdress = results[0].address_components[0].long_name + " "+
							results[0].address_components[1].long_name + ", "+
							results[1].formatted_address;
						cb(null,fulladdress);
					}
					else{
						cb(error("No address retrieve"), null);
					}
				};
			});
		};

		
		function geocodeAddress(geocoder, resultsMap) {
        var address = document.getElementById('where').value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }

		/**
		 *
		 * @param geocoder
		 * @param map
		 * @param infowindow
		 * @param gdata
		 */
		function geocodeLatLng(geocoder, map, infowindow,gdata) {
			var latlng = {lat: gdata.latitude, lng: gdata.longitude};
			geocoder.geocode({'location': latlng}, function(results, status) {

				if (status === google.maps.GeocoderStatus.OK) {
					if (results[1]) {
						map.setZoom(11);
						var marker = new google.maps.Marker({
							position: latlng,
							map: map,
							draggable: true
						});
						infowindow.setContent(results[0].formatted_address);
						$scope.$apply(function(){

							var fulladdress = results[0].address_components[0].long_name + " "+
								results[0].address_components[1].long_name + ", "+
								results[1].formatted_address;
							$scope.address = fulladdress;
							console.log(results);

						})
						infowindow.open(map, marker);
						//------- post the gps and address info-------
						var locationdata = {
							latitude :lat,
							longitude:lng,
							address: $scope.address,
							firstname: "anonymous",
							lastname: "anonymous",
							mobile: "27847849574"
						};
						$http.post("/updatelocation/"+orderid, locationdata).then(function(response){
							console.log("/updatelocation http-response: " + response.status);

						});
					} else {
						window.alert('No results found');
					}
				} else {
					window.alert('Geocoder failed due to: ' + status);
				}
			});
		}

	});


