'use strict';

angular.module('lvshackApp')
  .controller('ShackCtrl', function ($rootScope, $scope, $http, $localStorage, $sessionStorage, $timeout, Base64, CordovaService) {
  	$scope.$storage = $localStorage;
  	$scope.modalBeacon = {};
  	$scope.modal = false;
  	$scope.scanning = false;
  	$scope.beacons = [];

	var paramsObj = {"serviceAssignedNumbers":[]};
	var cordovaReady = false;
	var scanTimer = null;

    console.log("Starting main");
    CordovaService.ready.then(function() {
    	console.log("Cordova ready");
    	cordovaReady = true;
    	$scope.scanNow();
	});

	$scope.progress = function(){
		if($scope.scanning === true){
			return 100;
		} else {
			return 0;
		}
	};

	$scope.scanNow = function() {
		if(cordovaReady === true){
			console.log("Is initialized = " + window.bluetoothle.isInitialized());
	    	if(window.bluetoothle.isInitialized() !== true){
		    	window.bluetoothle.initialize(initializeSuccess, initializeError);
			} else {
				console.log("Is Scanning = " + window.bluetoothle.isScanning());
				if(window.bluetoothle.isScanning() !== true) {
					$scope.scanning = false;
					window.bluetoothle.startScan(startScanSuccess, startScanError, paramsObj);
				} else {
					$scope.scanning = true;
				}
			}
		} else {
			console.log("Cordova not ready");
		}
	}

	function initializeSuccess(obj)
	{
	  if (obj.status == "initialized")
	  {
        console.log("Bluetooth initialized successfully, starting scan for beacons...");
        window.bluetoothle.startScan(startScanSuccess, startScanError, paramsObj);
	  }
	  else
	  {
	    console.log("Unexpected initialize status: " + obj.status);
	  }
	}

	function initializeError(obj)
	{
	  console.log("Initialize error: " + obj.error + " - " + obj.message);
	}

	function startScanSuccess(obj)
	{
	  if (obj.status === "scanResult")
	  {
	    var hexUuid = Base64.Convert(obj.advertisement);
	    var uuid = hexUuid.substring(18,50);
	    var major = hexUuid.substring(50,54);
	    var minor = hexUuid.substring(54,58);
	    var power = -(~parseInt("0xFFFFFF"+hexUuid.substring(58,60)) + 1);

		obj.uuid = uuid;
		obj.major = major;
		obj.minor = Number(minor);
		obj.power = power;

		var distance = obj.rssi - obj.power;
		if(distance < 0){
			obj.dis = 2;
		} else {
			obj.dis = 0;
		}

		//console.log(uuid + ":" + major + ":" + minor + ":" + power);

		var exists = false;
        $scope.beacons.forEach(function (d, index) {
            if (d.uuid+d.major+d.minor === obj.uuid+obj.major+obj.minor) {
                exists = true;
                $scope.beacons[index] = obj;
                writeRssi(obj);
            }
        });

		if(exists === false ) {
			$scope.beacons.push(obj);
			writeRssi(obj);
		}
		$scope.$apply();
		}
		else if (obj.status === "scanStarted")
		{
			$scope.scanning = true;
			console.log("Scan was started successfully, stopping in 60 seconds");
			scanTimer = setTimeout(scanTimeout, 20000);
		}
		else
		{
			console.log("Unexpected start scan status: " + obj.status);
		}
	}

    function writeRssi(beacon) {
    	if( isNaN(beacon.minor) === false ){
			$http({
		        url: $rootScope.url + "beacon/" + beacon.minor,
		        method: "PUT",
		        timeout: 2000,
		        data: JSON.stringify({"distance": beacon.dis}),
		        headers: {'Content-Type': 'application/json'}
		    }).success(function(data) {
		    		//console.log(data);
		        }).error(function(data, status) {
		        	//console.log(data);
		        });
	    }
    }

	function startScanError(obj)
	{
		$scope.scanning = false;
	 	console.log("Start scan error: " + obj.error + " - " + obj.message);
	}

	function stopScanSuccess(obj)
	{
		$scope.scanning = false;
	  if (obj.status == "scanStopped")
	  {
	    console.log("Scan was stopped successfully");
	    //window.bluetoothle.startScan(startScanSuccess, startScanError, paramsObj);
	  }
	  else
	  {
	    console.log("Unexpected stop scan status: " + obj.status);
	  }
	}

	function stopScanError(obj)
	{
		$scope.scanning = false;
	  	console.log("Stop scan error: " + obj.error + " - " + obj.message);
	}

	function scanTimeout()
	{
	  console.log("Scan time out, stopping");
	  $scope.scanning = false;
	  $scope.$apply();
	  window.bluetoothle.stopScan(stopScanSuccess, stopScanError);
	}

	function clearScanTimeout()
	{ 
	  console.log("Clearing scanning timeout");
	  if (scanTimer != null)
	  {
	    clearTimeout(scanTimer);
	  }
	}

    $scope.modalOpen = function(beacon) {
    	console.log(beacon);
		$scope.modalBeacon = beacon;
		$scope.modal = true;
    };

    $scope.modalClose = function() {
		$scope.modalBeacon = {};
		$scope.modal = false;
    };

    //open link in external browser session
    $scope.openWebsite = function(url) {
    	window.open(url, "_system");
    }

  });
