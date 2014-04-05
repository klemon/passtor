var appX = angular.module('app', [
	'ngRoute',
	'dashboard'
	]);

appX.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  
  $routeProvider.otherwise({redirectTo:'/'});
  $locationProvider.html5Mode(true);
  
  }]);


appX.controller('AppCtrl', ['$scope', function($scope) {


}]);