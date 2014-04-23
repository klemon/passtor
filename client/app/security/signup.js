var signup = angular.module('signup', []);

signup.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl:'app/security/signup.tpl.ejs',
    resolve: signup.resolve
  });
}]);



signup.controller('SignupCtrl', ['$scope', '$location','AuthService', function($scope, $location, AuthService) {
	$scope.message;
	$scope.formData = {};
	$scope.signup = function(){
		if(!$scope.formData.username)
		{
			$scope.message = "Please provide an username.";
			return;
		}
		else if(!$scope.formData.password)
		{
			$scope.message = "Please provide a password.";
			return;
		}
		AuthService.signup($scope.formData, function(message){
			$scope.message = message;
			if(!message)
				$location.path('/login');
		});
	}
	
}]);