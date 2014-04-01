'use strict';

angular.module('lvshackApp')
  .controller('MainCtrl', function ($rootScope, $scope, $http, $localStorage, $sessionStorage, $location) {
  	$scope.$storage = $localStorage;

    $scope.updateEmail = function (email) {
    	if(typeof $scope.email !== 'undefined') {
    		$scope.$storage.email = $scope.email;
    		$location.path('/');
    		register($scope.email);
    	} else if(typeof $scope.$storage.email !== 'undefined'){
    		$location.path('/');
    		register($scope.email);
    	}

    }

    function register(email) {
		$http({
	        url: $rootScope.url + "user",
	        method: "POST",
	        timeout: 10000,
	        data: JSON.stringify({"_id": $scope.email}),
	        headers: {'Content-Type': 'application/json'}
	    }).success(function(data) {
	    	console.log("registered: " + $scope.email);

	        }).error(function(data, status) {
	        	console.log("failed register");

	        });
    }
  });
