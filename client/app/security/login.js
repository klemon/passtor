var login = angular.module('login', []);

login.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl:'app/security/login.tpl.ejs',
    resolve: login.resolve
  });
}]);



login.controller('LoginCtrl', ['$scope', '$location','AuthService', function($scope, $location, AuthService) {
	$scope.message;
	$scope.formData = {};

	$scope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
    	$scope.isLoggedIn = isLoggedIn;
    	$scope.currentUser = AuthService.currentUser();
  	});

	$scope.login = function() {
		AuthService.login($scope.formData, function(message){
			$scope.message = message;
			if(!message)
				$location.path('/dashboard');
		});
	}
}]);