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
		if(!$scope.formData.email)
		{
			$scope.message = "Please provide an email.";
			return;
		}
		else if(!$scope.formData.password)
		{
			$scope.message = "Please provide a password.";
			return;
		}
		AuthService.login($scope.formData, function(message){
			$scope.message = message;
			if(AuthService.isStoreOwner())
				$location.path('/inventory');
			else if(!$scope.message)
				$location.path('/dashboard');
		});
	}
}]);