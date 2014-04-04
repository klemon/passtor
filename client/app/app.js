'use strict'

angular.module('app', [
	'ngRoute'
	// ,
	// 'dashboard'
	]);

angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.otherwise({redirectTo:'/dashboard'});
}]);

angular.module('app').controller('AppCtrl', ['$scope', function($scope) {


}]);