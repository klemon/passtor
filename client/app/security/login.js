var login = angular.module('login', []);

login.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl:'app/security/login.tpl.ejs',
    resolve: login.resolve
  });
}]);



login.controller('LoginCtrl', ['$scope', 'AuthService', function($scope, AuthService) {
	$scope.message = "Hello User!";
	$scope.formData = {};

	$scope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
    	$scope.isLoggedIn = isLoggedIn;
    	$scope.currentUser = AuthService.currentUser();
  	});

	$scope.login = function() {
		AuthService.login($scope.formData);
	}

	$scope.getMessage = function() {
		if ($scope.isLoggedIn)
			return $scope.currentUser;
		return $scope.message;
	}
}]);