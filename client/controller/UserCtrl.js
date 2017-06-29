angular.module("SwiftControllers")
	.config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider){

		$stateProvider.state('register',{
			url:'/',
			templateUrl: '/register.html',
			controller: 'UserCtrl'
		})
	}])
	.controller("UserCtrl", function($scope,$http,$location,$log){

		$scope.submitUsers = submitUsers;
		$scope.remove = remove;
		$scope.edit = edit;

		var refresh = function(){
			console.log("----enter refresh()---");
			$http.get("/userlist")
				.then(function(response){
					$scope.userlist = response.data;
					console.log($scope.userlist);
				});
		}
		//refresh userlist when page loads
		refresh();

		//---------------- function to submit Users----------------
		function submitUsers(){
			console.log("Submitting users :" + $scope.firstname + "_" + $scope.lastname);

			var reqData = {
				firstname:$scope.firstname,
				lastname:$scope.lastname,
				email: $scope.email,
				mobile:$scope.mobile,
				idnumber:$scope.idnumber,
				username: $scope.username,
				hashstring: $scope.hashstring
			};
			var data = JSON.stringify(reqData);
			console.log(data);

			$http.post("/createuser",data)
				.then(function(document){

				//success handler
					if(document) {
						console.log("successfully posted: " + status);
						refresh();
						$scope.firstname = "";
						$scope.lastname = "";
						$scope.email = "";
						$scope.mobile = "";
						$scope.idnumber = "";
						$scope.username = "";
						$scope.hashstring = "";
					}

			});
		}//end submitUsers()

		function remove(id){
			console.log("Id to be deleted is:" + id);
			$http.delete("/deletebyid/" + id)
				.then(function(response){
				console.log("delete successful :" + response);
				refresh();
			});
		}//end remove()

		function edit(id){
			console.log("id to be edited :" + id);
			$http.get("/userbyid/" + id)
				.then(function(response){
				if(response){
					console.log( response + " " + JSON.stringify(response) + "");
					$scope.firstname = response[0].firstname;
					$scope.lastname = response[0].lastname;
					$scope.email = response[0].email;
					$scope.mobile = response[0].mobile;
					$scope.idnumber = response[0].idnumber;
				}
				else{
					console.log("no document");
				}
			});
		}//end edit()
	});