var login = angular.module('login', []);

login.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl:'app/security/login.tpl.html',
    resolve: login.resolve
  });
}]);

login.controller('LoginCtrl', ['$scope', '$rootScope', '$location','AuthService', 'User',
 function($scope, $rootScope, $location, AuthService, User) {
	$scope.message;
	$scope.formData = {};
	$scope.loginPromise;
	$scope.sendEmailPromise;
	$scope.lockedUser = false;
	$scope.expires = null;
	$scope.message2;
	$scope.login = function() {
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
		$scope.loginPromise = User.sendPromise('/login', $scope.formData);
		$scope.loginPromise.then(function(res) {
			if(res.data.message) {
				$scope.message = res.data.message;
			} else if(res.data.LockedUser) {
				$scope.lockedUser = true;
				$scope.expires = res.data.expires;
				$scope.formData = res.data.user;
			} else {
				User.setUser(res.data);
				$rootScope.$broadcast('loggedIn');
				AuthService.setToken(res.data.token, res.data.expires);
				if(res.data.storeOwner)
					$location.path('/sOItems');
				else
					$location.path('/posts');
			}
		});
	}
	$scope.sendEmail = function() {
		$scope.sendEmailPromise = User.sendPromise('/sendEmail', $scope.formData);
		$scope.sendEmailPromise.then(function(res) {
			$scope.message2 = "Another confirmation email was sent to you. Please check your email to complete your registration.";
		})
	}
}]);