angular.module("SwiftControllers")
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('locationview', {
            url: '/',
            templateUrl: 'location_view.html',
            controller: 'LocationCtrl'
        })

    }])
    .controller("LocationCtrl", function ($scope, $http) {

        var dt = new Date();
        var lat, lng;
        var map;
        var circleArray = [];
        var allVehicleCircles = [];
        var riderCircles = [];

        $scope.name = "Tinyiko";
        $scope.datetime = dt.toUTCString();
        $scope.getVehiclesNear = getVehiclesNear;
        $scope.logDriverPosition = logDriverPosition;

        var directionsDisplay, pos;
        var current_pos, destination_pos;
        var directionsService = new google.maps.DirectionsService();
        var lineSymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5,
            fillColor: 'yellow',
            fillOpacity: 0.8,
            strokeColor: '#DC143C'
        }

        var vehicleSymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 2,
            fillColor: 'orange',
            fillOpacity: 0.0,
            strokeColor: '#FF00FF'
        }

        var riderSymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 2,
            fillColor: 'orange',
            fillOpacity: 0.0,
            strokeColor: '#000000'
        }

        var dragMarker, center;
        var vehicleMarker;

        initialize();
        //------------------------initialize()---------------------------
        /**
         * Method used to initialize google map and getCurrentLocation using the
         * geolocation API
         */
        function initialize() {
            directionsDisplay = new google.maps.DirectionsRenderer({
                polylineOptions: {
                    strokeColor: "#DC143C",
                    strokeWeight: "2",
                },
                suppressMarkers: true
            });

            var mapCanvas = document.getElementById('mapBox');
            if (typeof google === 'object' && typeof google.maps === 'object') {
                var mapOptions = {
                    center: new google.maps.LatLng(-26.061204, 28.087798),
                    zoom: 10,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: false
                }
                map = new google.maps.Map(mapCanvas, mapOptions);
            }

            google.maps.event.addListener(map, 'drag', function () {
            });
            google.maps.event.addListener(map, 'dragend', function () {
                loc(map);
            });

            /**
             * listen to click event on cell button
             */
            document.getElementById('cell').addEventListener('click', function () {
                calcRoute(center, current_pos);
                circleArray.forEach(function (cell) {
                    cell.setMap(null);
                });
                allVehicleCircles.forEach(function(vehicle_circle){
                    vehicle_circle.setMap(null);
                });
                riderCircles.forEach(function(rider){
                    rider.setMap(null);
                });
            });

            var infoWindow = new google.maps.InfoWindow;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    current_pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    dragMarker = new google.maps.Marker({
                        position: current_pos,
                        icon: lineSymbol,
                        draggable: true,
                        map: map
                    });
                    setupAutoComplete(map); //setup AutoComplete
                    google.maps.event.addListener(dragMarker, 'dragend', function (drag_event) {
                        console.log("marker dragged :" + drag_event.latLng);
                        destination_pos = drag_event.latLng;
                        console.log("destination_pos ===  " + destination_pos);
                        var drag_position = new google.maps.LatLng(drag_event.latLng.lat(),
                            drag_event.latLng.lng());
                        calcRoute(drag_position, current_pos);
                        setDestinationGPS(drag_position);
                    });
                    map.setCenter(pos);
                }, function () {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            }

        }

        /**
         * setup map and point to centre and get current location address
         * @param map
         */
        function loc(map) {
            center = map.getCenter();
            lat = center.lat().toFixed(6);
            lng = center.lng().toFixed(6);

            window.setTimeout(function () {
                getAddress(center, function (error, results) {
                    $scope.$apply(function () {
                        $scope.address = results;
                        $scope.gdata = {
                            latitude: center.lat().toFixed(6),
                            longitude: center.lng().toFixed(6),
                            gps_latlng: center.lat().toFixed(6) + "," + center.lng().toFixed(6)
                        };

                    });
                });
            }, 0);
        }

        /**
         * log the GPS position of driver
         */
        function logDriverPosition(vehicle_id) {
            vehicle_id = "5578";
            console.log("logDriverPositino ...." + lat + "," + lng + "," + vehicle_id);
            var driverposition = {
                latitude: lat,
                longitude: lng,
                vehicle_id: vehicle_id
            };
            if (isNaN(lat) && isNaN(lng)) {
                console.log("no location set...");
                //document.getElementById('gps').innerHTML = "enter location";
                //$scope.gdata.gps_latlng = "no loc";
                document.getElementById("gps").style.color = "#FF4500";
                return;
            }
            else {
                //document.getElementById("latlng").style.color = "#000000";
                $http.post("/updatelocation/" + vehicle_id, driverposition).success(function (response) {
                    console.log(response);
                })
            }
        }

        /**
         * Method used to update location of customer
         */
        function getVehiclesNear() {
            var riderid = "ZUL004";
            console.log("updateLocation trigger :");
            console.log($scope.address + "," + lat + "," + lng);

            var locationdata = {
                latitude: lat,
                longitude: lng,
                address: $scope.address,
                firstname: $scope.firstname,
                lastname: $scope.lastname,
                mobile: $scope.mobile
            };

            $http.post("/getvehiclesnear/" + riderid, locationdata).then(function (response) {
                console.log("response from goSwift-conman:" + JSON.stringify(response.data.body));
                var vehicles = response.data.body;

                vehicles.forEach(function (item) {
                    var lat = item.latitude;
                    var lng = item.longitude;
                    var vehicle_pos = new google.maps.LatLng(lat, lng);

                    vehicleMarker = new google.maps.Marker({
                        position: vehicle_pos,
                        icon: vehicleSymbol,
                        draggable: true,
                        map: map
                    });
                    allVehicleCircles.push(vehicleMarker);
                })

                var centerMarker = new google.maps.Marker({
                    position: map.getCenter(),
                    icon: riderSymbol,
                    map: map
                });
                riderCircles.push(centerMarker);

                var circle = new google.maps.Circle({
                    map: map,
                    strokeColor: '#000000',
                    strokeWeight: 1,
                    //fillOpacity: 0.0,
                    center: center,
                    radius: 2680,    // 10 miles in metres
                });

                circleArray.push(circle);
                //circle.bindTo('center', centerMarker, 'position');
            });
        }

        /**
         * methods does route directions calcs
         * @param start
         * @param end
         */
        function calcRoute(start, end) {
            /*var bounds = new google.maps.LatLngBounds();
             bounds.extend(start);
             bounds.extend(end);
             map.fitBounds(bounds);*/

            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap(map);
                } else {
                    console.log("Directions Request from " + start.toUrlValue(6) +
                        " to " + end.toUrlValue(6) + " failed: " + status);
                }

                var route = response.routes[0];
                var totalDistance = 0;
                var totalDuration = 0;
                var legs = response.routes[0].legs;
                for (var i = 0; i < legs.length; ++i) {
                    totalDistance += legs[i].distance.value;
                    totalDuration += legs[i].duration.value;
                }
                console.log("route distance = " + totalDistance + "/duration=" + totalDuration);
                $scope.$apply(function () {
                    $scope.mobile = totalDistance + " meters";
                });
            });
        }

        /*------------------------------------------------*/
        function setupAutoComplete(map) {
            var input = document.getElementById('searchInput');
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            var auto_place = new google.maps.places.Autocomplete(input);
            auto_place.bindTo('bounds', map);

            auto_place.addListener('place_changed', function () {
                //infowindow.close();
                //marker2.setVisible(false);
                var place = auto_place.getPlace();
                if (!place.geometry) {
                    window.alert("Autocomplete's returned place contains no geometry");
                    return;
                }

                //If the place has a geometry, then present it on a map.
                /*if (place.geometry.viewport) {
                 map.fitBounds(place.geometry.viewport);
                 } else {
                 map.setCenter(place.geometry.location);
                 map.setZoom(11);
                 }*/
                //map.setCenter(place.geometry.location);
                //map.setZoom(10);
                dragMarker.setPosition(place.geometry.location);
                //marker2.setVisible(true);
                calcRoute(pos, place.geometry.location);
                //add code to update trip_destination and all text inputs

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
                    if (place.address_components[i].types[0] == 'postal_code') {
                        //console.log(place.address_components[i].long_name);
                        //document.getElementById('postal_code').innerHTML = place.address_components[i].long_name;
                    }
                    if (place.address_components[i].types[0] == 'country') {
                        document.getElementById('country').innerHTML = place.address_components[i].long_name;
                    }
                }
                document.getElementById('location').innerHTML = place.formatted_address;
                if (place.geometry.location) {
                    /*document.getElementById('lat').innerHTML = place.geometry.location.lat().toFixed(6);
                     document.getElementById('lon').innerHTML = place.geometry.location.lng().toFixed(6);*/
                    setDestinationGPS(place.geometry.location);
                    destination_pos = place.geometry.location;
                    console.log("destination_pos ===  " + destination_pos);
                }
            });
        }

        function setDestinationGPS(latlng) {
            document.getElementById('lat').innerHTML = latlng.lat().toFixed(6);
            document.getElementById('lon').innerHTML = latlng.lng().toFixed(6);
        }
    })


/*------------------------------------------*/
/**
 * method listens for dragend event on google map and retrieve LatLng associated
 * with event
 * @param markerobject
 */
function markerCoords(markerobject) {
    google.maps.event.addListener(markerobject, 'dragend', function (evt) {
        markerobject.setOptions({
            position: evt.latLng
        });

        infoWindow.setOptions({
            content: '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) +
            ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>'
        });
        console.log("is this center:" + evt.latLng);
    });
    google.maps.event.addListener(markerobject, 'drag', function (evt) {
        console.log("marker is being dragged");
    });
}

/**
 * callback function invoked when the getCurrentLocation() returns errors
 * @param error
 */

function positionError(error) {
    console.log("position err: " + error);
    counter++;
    var myinterval = setInterval(function () {
        console.log("calling geo-location supported :" + counter);
        $scope.address = "Geo-location supported";
        if (counter === 4) {
            clearInterval(myinterval)
        }
        ;
    }, 5000);
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

    $scope.$apply(function () {
        $scope.gdata = {
            latitude: lat,
            longitude: lng,
            gps_latlng: lat + "," + lng
        };
    });

    var acr = position.coords.accuracy;
    console.log("lat: " + lat + ", lon :" + lng);

    var mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions);
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    geocodeLatLng(geocoder, map, infowindow, position.coords);
}


/**
 * Method used to geocode GPS latlng to address and format into an address string.
 * @param gdata, LatLng object
 * @param cb, callback function
 */
function getAddress(gdata, cb) {
    var geocoder2 = new google.maps.Geocoder;
    geocoder2.geocode({'location': gdata}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0] != null && results[1] != null) {
                var fulladdress = results[0].address_components[0].long_name + " " +
                    results[0].address_components[1].long_name + ", " +
                    results[1].formatted_address;
                cb(null, fulladdress);
            }
            else {
                cb(error("No address retrieve"), null);
            }
        }
        ;
    });
};


function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('where').value;
    geocoder.geocode({'address': address}, function (results, status) {
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
function geocodeLatLng(geocoder, map, infowindow, gdata) {
    var latlng = {lat: gdata.latitude, lng: gdata.longitude};
    geocoder.geocode({'location': latlng}, function (results, status) {

        if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                map.setZoom(11);
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    draggable: true
                });
                infowindow.setContent(results[0].formatted_address);
                $scope.$apply(function () {

                    var fulladdress = results[0].address_components[0].long_name + " " +
                        results[0].address_components[1].long_name + ", " +
                        results[1].formatted_address;
                    $scope.address = fulladdress;
                    console.log(results);

                })
                infowindow.open(map, marker);
                //------- post the gps and address info-------
                var locationdata = {
                    latitude: lat,
                    longitude: lng
                };
                $http.post("/updatelocation/" + riderid, locationdata).then(function (response) {
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


