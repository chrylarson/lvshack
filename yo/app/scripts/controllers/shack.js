'use strict';

angular.module('lvshackApp')
  .controller('ShackCtrl', function ($rootScope, $scope, $http, $localStorage, $sessionStorage, Base64, CordovaService) {
  	$scope.$storage = $localStorage;
  	$scope.modalBeacon = {};
  	$scope.modal = false;
  	$scope.scanning = false;
  	$scope.bands = [];
  	$scope.beacons = [];

  	//timeline();

    console.log("Woot Start main");
    CordovaService.ready.then(function() {
	    window.bluetoothle.initialize(initializeSuccess, initializeError);
	});
	var addressKey = "address";
	var paramsObj = {"serviceAssignedNumbers":[]};
	var scanTimer = null;

	function initializeSuccess(obj)
	{
	  if (obj.status == "initialized")
	  {
        console.log("Bluetooth initialized successfully, starting scan for music beacons.");
        window.bluetoothle.startScan(startScanSuccess, startScanError, paramsObj);
	  }
	  else
	  {
	    console.log("Unexpected initialize status: " + obj.status);
	  }
	}

	$scope.scanNow = function() {
		window.bluetoothle.initialize(initializeSuccess, initializeError);
	}

	function initializeError(obj)
	{
	  console.log("Initialize error: " + obj.error + " - " + obj.message);
	}

	function startScanSuccess(obj)
	{
		$scope.scanning = true;
	  if (obj.status == "scanResult")
	  {
	    console.log("Stopping scan..");
	    window.bluetoothle.stopScan(stopScanSuccess, stopScanError);
	    clearScanTimeout();

	    var hexUuid = Base64.Convert(obj.advertisement);
	    var uuid = hexUuid.substring(18,50);
	    var major = hexUuid.substring(50,54);
	    var minor = hexUuid.substring(54,58);
	    var power = hexUuid.substring(58,62);

	    console.log(uuid + ":" + major + ":" + minor + ":" + power);

		obj.uuid = uuid;
		obj.major = major;
		obj.minor = minor;
		obj.power = power;

		console.log(uuid);

		var exists = false;

        $scope.beacons.forEach(function (d, index) {
            if (d.advertisement === obj.advertisement) {
                exists = true;
            }
        });
		if(exists === false ) {
			$scope.beacons.push(obj);
			visit(obj);
		}


	  }
	  else if (obj.status == "scanStarted")
	  {
	  	$scope.scanning = true;
	    console.log("Scan was started successfully, stopping in 10");
	    scanTimer = setTimeout(scanTimeout, 10000);
	  }
	  else
	  {
	    console.log("Unexpected start scan status: " + obj.status);
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
	    window.bluetoothle.startScan(startScanSuccess, startScanError, paramsObj);
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
	  window.bluetoothle.initialize(initializeSuccess, initializeError);
	}

	function scanTimeout()
	{
	  console.log("Scanning time out, stopping");
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
