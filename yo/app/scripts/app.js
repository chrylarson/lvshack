'use strict';

angular.module('lvshackApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngStorage',
  'fsCordova'
])
  .config(function ($routeProvider, $sceDelegateProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/shack', {
        templateUrl: 'views/shack.html',
        controller: 'ShackCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
      //white list external services
      $sceDelegateProvider.resourceUrlWhitelist([
       'self',
       "https://embed.spotify.com/**"
      ]);

  })
  .run(['$rootScope', '$location', '$localStorage', '$sessionStorage',  function ($rootScope, $location, $localStorage, $sessionStorage) {
        $rootScope.$storage = $localStorage;
        $rootScope.url = "http://ec2-54-204-111-15.compute-1.amazonaws.com/";
        console.log($rootScope.$storage.email);
          if (typeof $rootScope.$storage.email !== 'undefined') {
            $location.path('/shack');
          }
          else {
            $location.path('/');
          }
    }]);