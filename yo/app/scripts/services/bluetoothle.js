'use strict';

angular.module('lvshackApp')
  .factory('Bluetoothle', function Bluetoothle($rootScope, phonegapReady) {
    return {
        initialize: phonegapReady(function (onSuccess, onError) {
            navigator.bluetoothle.initialize(function () {
              console.log("init bluetooth");
                var that = this,
                    args = arguments;

                if (onSuccess) {
                    $rootScope.$apply(function () {
                        onSuccess.apply(that, args);
                    });
                }
            }, function () {
                var that = this,
                args = arguments;

                if (onError) {
                    $rootScope.$apply(function () {
                        onError.apply(that, args);
                    });
                }
            });
        })
    };    
  });
