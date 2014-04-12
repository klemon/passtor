var login = angular.module('login', []);

login.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl:'app/security/login.tpl.ejs',
    resolve: login.resolve
  });
}]);



login.controller('LoginCtrl', ['$scope', function($scope) {
	$scope.message = "Hello!";
	$scope.getMessage = function() {
		return $scope.message;
	}
}]);